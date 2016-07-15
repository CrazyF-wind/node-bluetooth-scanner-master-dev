macarray=("A4:B4:76:5E:B6:8D")
namearray=("Honor zero-68D")
flagarray=("2")
for j in "${!macarray[@]}";
do
	for ((i=0;i<100;i++));do
	printf "%s\t%s\n%s\t" "$i" "${macarray[$j]}" "${namearray[$j]}"
	node basic.js ${macarray[$j]} ${flagarray[$j]} ${namearray[$j]}
	done
done
