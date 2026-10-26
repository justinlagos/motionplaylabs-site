#!/usr/bin/env bash
# Re-encodes every clip from media/sources with the settings used on the site.
cd "$(dirname "$0")/.."
E=scripts/encode-video.sh
S=media/sources
run() { echo "== $2"; bash $E "$@" 2>/dev/null | tr '\n' ' '; echo; }
run $S/droplets.mp4   droplets   4  9  50 "hue=s=0.35" fade
run $S/inkclouds.mp4  inkclouds  19 10 50 "" fade
run $S/soapfilm.mp4   soapfilm   2  9  50 "" fade
run $S/pencil.mp4     pencil     3  9  30 "colorlevels=rimax=0.86:gimax=0.86:bimax=0.86,eq=gamma=1.2" fade
run $S/folds.mp4      folds      2  6  50 "colorlevels=rimax=0.93:gimax=0.93:bimax=0.94" pingpong
run $S/ferrofluid.mp4 ferrofluid 1  5.5 60 "" pingpong
run $S/pigment.mp4    pigment    12 9  50 "colorlevels=rimax=0.92:gimax=0.94:bimax=0.99" fade
run $S/circuit.mp4    circuit    3  5  50 "eq=brightness=-0.07:saturation=0.75:contrast=1.1,colorlevels=rimin=0.06:gimin=0.14:bimin=0.1" pingpong
run $S/milkdrop.mp4   milkdrop   29 9  53 "colorlevels=rimax=0.885:gimax=0.882:bimax=0.925" fade
run $S/inkdark.mp4    inkdark    30 9  50 "colorlevels=rimax=0.8:gimax=0.8:bimax=0.8" fade
run $S/inkfade.mp4    inkfade    3  5  55 "" pingpong
run $S/magenta.mp4    magenta    18 9  50 "colorlevels=rimax=0.97:gimax=0.975:bimax=0.955" fade
run $S/dust.mp4       dust       34 9  40 "colorlevels=rimax=0.5:gimax=0.5:bimax=0.5" fade
du -sh public/media
