#!/bin/bash
# Horizontal full-frame films (16:9, 6 s per shot) from scripts/videos.json, with music.
cd "$(dirname "$0")/.." || exit 1
SD=/Volumes/SD_Card/DCIM/DJI_001; T=$(mktemp -d)
python3 -c "
import json
for v in json.load(open('scripts/videos.json')):
    print(v['id'], v['music'], ' '.join(f'{c}:{t}' for c,t in v['clips']))" | while read id MUSIC clips; do
  out=videos/$id.mp4; [ -f "$out" ] && continue; : > $T/list.txt; i=0
  for ct in $clips; do c=${ct%%:*}; t=${ct##*:}; f=$(ls $SD/*_${c}_D.MP4)
    nice -n 10 ffmpeg -nostdin -v error -y -ss $t -t 6 -i "$f" -an -vf "scale=1920:1080,fps=30,setsar=1" -c:v libx264 -crf 16 -preset fast $T/$i.mp4
    echo "file '$T/$i.mp4'" >> $T/list.txt; i=$((i+1)); done
  dur=$((i*6))
  nice -n 10 ffmpeg -nostdin -v error -y -f concat -safe 0 -i $T/list.txt -i "$MUSIC" -filter_complex "[0:v]fade=in:0:20,fade=out:st=$((dur-1)):d=1[v];[1:a]atrim=0:$dur,afade=in:0:1.5,afade=out:st=$((dur-3)):d=3,loudnorm=I=-16:TP=-1.5[a]" -map "[v]" -map "[a]" -c:v libx264 -crf 19 -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart "$out" && echo "ok $id ${dur}s"
done
rm -rf $T
