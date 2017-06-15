tar -cvzf ferry.tar.gz *
scp ferry.tar.gz root@67.207.94.143:
ssh -t root@67.207.94.143 " 
screen -x getferry &&
kill -INT 888 &&
cd ferry-backend/ &&
mv ../ferry.tar.gz . &&
tar -xcvf ferry.tar.gz &&
python app.py
"

