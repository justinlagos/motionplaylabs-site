#!/usr/bin/env bash
# Re-encodes every clip from media/sources with the cut and grade used on the site.
# Sources are the free-licence originals listed on /legal/credits/ (not kept in git).
# Grade: colour is held back to about 40% saturation on every clip so the film reads as one
# documentary piece; pigment (Design) keeps full colour as the one colour moment.
set -euo pipefail
cd "$(dirname "$0")/.."
E=scripts/encode-video.sh
S=media/sources
M="hue=s=0.4"
run() { echo "== $2"; bash $E "$@" 2>/dev/null | tr '\n' ' '; echo; }
run $S/droplets.mp4   droplets   4  9  50 "hue=s=0.3" fade
run $S/inkclouds.mp4  inkclouds  19 10 50 "$M" fade
run $S/soapfilm.mp4   soapfilm   2  9  50 "hue=s=0.55" fade
PRE="crop=iw*0.6:ih*0.6:iw*0.02:ih*0.12" run $S/inkdrops.mp4 inkdrops 3 9 45 "$M,colorlevels=rimax=0.9:gimax=0.9:bimax=0.9" fade
run $S/folds.mp4      folds      2  6  50 "$M,colorlevels=rimax=0.93:gimax=0.93:bimax=0.94" pingpong
run $S/smoke.mp4      smoke      1  9  65 "$M,colorlevels=rimax=0.8:gimax=0.8:bimax=0.8" fade
run $S/ferrofluid.mp4 ferrofluid 1  5.5 60 "$M" pingpong
run $S/pigment.mp4    pigment    12 9  50 "colorlevels=rimax=0.92:gimax=0.94:bimax=0.99" fade
run $S/circuit.mp4    circuit    3  5  50 "eq=brightness=-0.07:saturation=0.4:contrast=1.1,colorlevels=rimin=0.06:gimin=0.1:bimin=0.08" pingpong
PRE="crop=iw*0.62:ih*0.62:iw*0.19:ih*0.36" run $S/milkdrop.mp4 milkdrop 30 9 50 "$M,colorlevels=rimax=0.885:gimax=0.882:bimax=0.925" fade
run $S/inkdark.mp4    inkdark    30 9  50 "$M,colorlevels=rimax=0.8:gimax=0.8:bimax=0.8" fade
run $S/inkfade.mp4    inkfade    3  5  55 "$M" pingpong
run $S/magenta.mp4    magenta    18 9  50 "hue=s=0.55,colorlevels=rimax=0.97:gimax=0.975:bimax=0.955" fade
AV1_CRF=50 H264_CRF=31 run $S/dust.mp4 dust 34 9 40 "hqdn3d=6:4:8:6,$M,colorlevels=rimax=0.6:gimax=0.6:bimax=0.6" fade
du -sh public/media
