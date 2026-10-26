#!/usr/bin/env bash
# Encode one graded master clip into the files the film needs.
#
#   scripts/encode-video.sh media/masters/H1.mov H1
#
# Writes to public/media/<ID>/ :
#   <ID>-1080.av1.mp4   1920x1080 AV1   (first choice)
#   <ID>-1080.h264.mp4  1920x1080 H.264 (fallback)
#   <ID>-v.av1.mp4      1080x1920 AV1   (phones; centre crop unless a portrait master is given)
#   <ID>-v.h264.mp4     1080x1920 H.264
#   <ID>-poster.avif / -poster.jpg      first frame, shown while loading and for reduced motion
#   <ID>-index.mp4      256x144 index loop
#
# Budget (playbook section 18): hero under 3 MB desktop and 1.5 MB phone; other clips under 2 MB.
# No audio. Clips loop, so keep masters 8 to 15 seconds with a clean loop point.
# For production, host public/media on Cloudflare R2 behind media.motionplaylabs.com.

set -euo pipefail
IN="${1:?master file}"
ID="${2:?clip id, e.g. H1}"
PORTRAIT="${3:-}"
OUT="public/media/${ID}"
mkdir -p "$OUT"

LAND="scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=24"
if [[ -n "$PORTRAIT" ]]; then
  VSRC="$PORTRAIT"; VERT="scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=24"
else
  VSRC="$IN"; VERT="scale=-2:1920,crop=1080:1920,fps=24"
fi

# AV1 (SVT-AV1). Raise -crf if a file is over budget.
ffmpeg -y -loglevel error -i "$IN" -an -vf "$LAND" -c:v libsvtav1 -preset 6 -crf 38 -pix_fmt yuv420p "$OUT/${ID}-1080.av1.mp4"
ffmpeg -y -loglevel error -i "$VSRC" -an -vf "$VERT" -c:v libsvtav1 -preset 6 -crf 40 -pix_fmt yuv420p "$OUT/${ID}-v.av1.mp4"

# H.264 fallback, fast start so playback begins before the file finishes loading.
ffmpeg -y -loglevel error -i "$IN" -an -vf "$LAND" -c:v libx264 -preset veryfast -crf 26 -pix_fmt yuv420p -movflags +faststart "$OUT/${ID}-1080.h264.mp4"
ffmpeg -y -loglevel error -i "$VSRC" -an -vf "$VERT" -c:v libx264 -preset veryfast -crf 27 -pix_fmt yuv420p -movflags +faststart "$OUT/${ID}-v.h264.mp4"

# Posters and the index loop
ffmpeg -y -loglevel error -i "$IN" -vf "$LAND" -frames:v 1 -q:v 3 "$OUT/${ID}-poster.jpg"
ffmpeg -y -loglevel error -i "$OUT/${ID}-poster.jpg" -c:v libaom-av1 -still-picture 1 -crf 32 "$OUT/${ID}-poster.avif" 2>/dev/null || true
ffmpeg -y -loglevel error -i "$IN" -an -vf "scale=256:144:force_original_aspect_ratio=increase,crop=256:144,fps=24" -c:v libx264 -preset veryfast -crf 30 -movflags +faststart "$OUT/${ID}-index.mp4"

echo "Sizes:"
ls -lh "$OUT"
