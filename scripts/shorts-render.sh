#!/bin/bash
# Renders vertical 9:16 Shorts (12 s) from the SD card clips listed in scripts/shorts.json.
cd "$(dirname "$0")/.." || exit 1
SD=/Volumes/SD_Card/DCIM/DJI_001; MUSIC=$HOME/Projects/mitologias/public/musica/hawaiana.wav
python3 -c "import json;[print(s['id'],s['clip'],s['t']) for s in json.load(open('scripts/shorts.json'))]" | while read id clip t; do
  out=shorts/$id.mp4; [ -f "$out" ] && continue
  f=$(ls $SD/*_${clip}_D.MP4); m=$(( (10#${id#s} * 19) % 280 ))
  nice -n 10 ffmpeg -nostdin -v error -y -ss $t -t 12 -i "$f" -ss $m -t 12 -i "$MUSIC" \
    -filter_complex "[0:v]crop=ih*9/16:ih,scale=1080:1920,fps=30,fade=in:0:15,fade=out:st=11.4:d=0.6[v];[1:a]afade=in:0:1,afade=out:st=10.5:d=1.5,volume=0.8[a]" \
    -map "[v]" -map "[a]" -c:v libx264 -crf 20 -preset medium -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart "$out" && echo "ok $id"
done
