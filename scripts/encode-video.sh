#!/usr/bin/env bash
# Encode one source clip into the files the site needs, as a seamless loop.
#
#   scripts/encode-video.sh <source> <id> <start-seconds> <seconds> [focus-x 0..100] [extra-filters] [fade|pingpong]
#
#   scripts/encode-video.sh media/sources/ink.mp4 ink 3 9 50 "colorlevels=rimax=0.92:gimax=0.92:bimax=0.92"
#
# Writes public/media/<id>/:
#   1080.av1.mp4        1920x1080 AV1 (first choice)
#   1080.h264.mp4       1920x1080 H.264 (fallback)
#   portrait.h264.mp4   720x1280 crop for phones; focus-x picks the crop (50 = centre)
#   poster.webp, poster-portrait.webp   first frame, shown while loading and when motion is paused
#   thumb.mp4, thumb.webp               640x360 loop for small tiles
#
# The loop, two ways:
#   fade (default)  the clip's last second dissolves into its first, so playback wraps without a jump.
#                   Good for fluids, smoke and anything without camera movement.
#   pingpong        the clip plays forward then backward. Good for a camera move or a moving light,
#                   where a dissolve would show the frame jumping back. The loop is twice <seconds>.
# No audio. Keep loops 8 to 10 seconds.
# Grainy or particle-heavy clips: raise AV1_CRF and H264_CRF (defaults 40 and 25) to keep files small.

set -euo pipefail
IN="${1:?source file}"
ID="${2:?clip id}"
START="${3:?start seconds}"
DUR="${4:?loop seconds}"
FOCUS="${5:-50}"
EXTRA="${6:-}"
MODE="${7:-fade}"
FADE=1
AV1_CRF="${AV1_CRF:-40}"
H264_CRF="${H264_CRF:-25}"
OUT="public/media/${ID}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$OUT"

SEG=$(python3 -c "print(${DUR}+${FADE})")
OFF=$(python3 -c "print(${DUR}-${FADE})")
G="${EXTRA:+,${EXTRA}}"

loop() { # $1 = per-frame filter for the shape, $2 = output
  if [[ "$MODE" == "pingpong" ]]; then
    ffmpeg -y -loglevel error -ss "$START" -t "$DUR" -i "$IN" -an -filter_complex \
      "[0:v]fps=25,$1${G},format=yuv420p,split[a][b];[b]reverse,trim=start_frame=1,setpts=PTS-STARTPTS[r];[a][r]concat=n=2:v=1:a=0[v]" \
      -map "[v]" -c:v libx264 -preset veryfast -crf 12 "$2"
    return
  fi
  ffmpeg -y -loglevel error -ss "$START" -t "$SEG" -i "$IN" -an -filter_complex \
    "[0:v]fps=25,$1${G},format=yuv420p,split[a][b];\
     [a]trim=start=${FADE}:end=${SEG},setpts=PTS-STARTPTS[m];\
     [b]trim=start=0:end=${FADE},setpts=PTS-STARTPTS[h];\
     [m][h]xfade=transition=fade:duration=${FADE}:offset=${OFF}[v]" \
    -map "[v]" -c:v libx264 -preset veryfast -crf 12 "$2"
}

# Masters: landscape and a 9:16 crop taken from the full source height
loop "scale=1920:1080:force_original_aspect_ratio=increase:flags=lanczos,crop=1920:1080" "$TMP/land.mp4"
loop "crop=ih*9/16:ih:(iw-ih*9/16)*${FOCUS}/100:0,scale=720:1280:flags=lanczos" "$TMP/port.mp4"

# Delivery files
ffmpeg -y -loglevel error -i "$TMP/land.mp4" -c:v libsvtav1 -preset 6 -crf "$AV1_CRF" -g 125 -pix_fmt yuv420p -movflags +faststart "$OUT/1080.av1.mp4"
ffmpeg -y -loglevel error -i "$TMP/land.mp4" -c:v libx264 -preset veryfast -crf "$H264_CRF" -maxrate 4M -bufsize 8M -g 50 -pix_fmt yuv420p -movflags +faststart "$OUT/1080.h264.mp4"
ffmpeg -y -loglevel error -i "$TMP/port.mp4" -c:v libx264 -preset veryfast -crf "$((H264_CRF + 1))" -maxrate 2M -bufsize 4M -g 50 -pix_fmt yuv420p -movflags +faststart "$OUT/portrait.h264.mp4"
ffmpeg -y -loglevel error -i "$TMP/land.mp4" -vf "scale=640:360:flags=lanczos" -c:v libx264 -preset veryfast -crf "$((H264_CRF + 2))" -g 50 -pix_fmt yuv420p -movflags +faststart "$OUT/thumb.mp4"

ffmpeg -y -loglevel error -i "$TMP/land.mp4" -frames:v 1 -c:v libwebp -quality 80 "$OUT/poster.webp"
ffmpeg -y -loglevel error -i "$TMP/port.mp4" -frames:v 1 -c:v libwebp -quality 80 "$OUT/poster-portrait.webp"
ffmpeg -y -loglevel error -i "$TMP/land.mp4" -frames:v 1 -vf "scale=640:360:flags=lanczos" -c:v libwebp -quality 78 "$OUT/thumb.webp"

du -h "$OUT"/* | sed "s|$OUT/||"
