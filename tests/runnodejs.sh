macarray=("00:4d:32:07:91:9c" "c8:0f:10:51:e6:5a")
namearray=("AM4" "MI1S")
for j in "${!array[@]}";
do
	for ((i=0;i<100;i++));do
	printf "%s\t%s\n%s\t" "$i" "${macarray[$j]}" "${namearray[$j]}"
	node basic.js ${macarray[$j]}
	sleep 5
	done
done
