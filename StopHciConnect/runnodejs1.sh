macarray=("00:4D:32:07:91:9C" "00:4D:32:07:90:4B" "00:4D:32:07:92:09" "C8:0F:10:51:E6:5A" "A4:B4:76:5E:B6:8D")
namearray=("AM4" "AM4" "AM4" "MI1S" "Honor zero-68D")
flagarray=("model_1" "model_1" "model_1" "model_1" "model_1")
for j in "${!macarray[@]}";
do
	for ((i=0;i<100;i++));do
	printf "%s\t%s\n%s\t" "$i" "${macarray[$j]}" "${namearray[$j]}"
	node basic.js ${macarray[$j]} ${flagarray[$j]} ${namearray[$j]}
	done
done
