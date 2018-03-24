#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main () {
  int totalevents = 0 , rebuffevents=0 , numf = 0 , loadtime=0;
  float rebufftime = 0;
  float totaltime = 0;
  float playertime = 0;
  string line;
  ifstream myfile ("/home/mohit/video1-log-file");
  if (myfile.is_open())
  {
    while ( getline (myfile,line) )
    {
      if(line.length()>10 && line[0] == 'b' && line[1] == 'u' && line[2] == 'f' && line[3] == 'f' && line[4] == 'e' && line[5] == 'r' && line[6] == ' ' && line[7] == 't' && line[8] == 'i' && line[9] == 'm' && line[10] == 'e') totalevents++;
      if(line.length()>23 && line[6] == 'r' && line[7] == 'e' && line[8] == 'b' && line[9] == 'u' && line[10] == 'f' && line[11] == 'f') 
        {
          rebuffevents++;
        	int num=0 ,numfloat;
      	int j=17;
      	while(line[j] != '.' && j<line.length() && line[j]>=48 && line[j]<=57) {num = num*10 + line[j]-48; j++;}
      	rebufftime += num;
      	j++;
      	if(line[j]>=48 && line[j]<=57)  numfloat = (line[j]-48)*100 + (line[j+1]-48)*10 + line[j+2]-48;
      	numf += numfloat;
        }
      if(line.length()>=10 && line[2] == 'd' && line[3] == 'i' && line[4] == 'f' && line[5] == 'f')
      {
        int j = 9;
        while(line[j]>=48 && line[j]<=57) {loadtime = loadtime*10 + line[j]-48;j++;}
      }
      if(line.length()>=19 && line[2] == 'b' && line[3] == 'u' && line[4] == 'f' && line[5] == 'f' && line[6] == 'e' && line[7] == 'r')
      {
      	int temp = 0,temp1;
      	int j=11;
      	while(line[j] != '.' && j<line.length() && line[j]>=48 && line[j]<=57) {temp = temp*10 + line[j]-48; j++;}
      	j++;
      	if(line[j]>=48 && line[j]<=57)  temp1 = (line[j]-48)*100 + (line[j+1]-48)*10 + line[j+2]-48;
      	totaltime = temp + (float)temp1/1000;      
      }
      if(line.length()>=17 && line[2] == 'p')
      {
      	int temp = 0,temp1;
      	int j=15;
      	while(line[j] != '.' && j<line.length() && line[j]>=48 && line[j]<=57) {temp = temp*10 + line[j]-48; j++;}
      	j++;
      	if(line[j]>=48 && line[j]<=57)  temp1 = (line[j]-48)*100 + (line[j+1]-48)*10 + line[j+2]-48;
      	playertime = temp + (float)temp1/1000;
      }
    }
    myfile.close();
    rebufftime += (float)numf/1000;
    //cout<<totalevents<<" "<<rebuffevents<<" "<<rebufftime<<" "<<totaltime<<endl;

    float Trebuff = 0;
    if(rebuffevents == 0)  Trebuff = (float)rebufftime/rebuffevents;
    float Frebuff = (float)rebufftime/totaltime;
    float loadtimef = (float)loadtime/1000;
    cout<<"Length of the video: "<<totaltime<<endl;
    cout<<"Initial Loading Time: "<<loadtimef<<endl;
    cout<<"No. of rebufferings: "<<rebuffevents<<endl;
    cout<<"Total Rebuff time: "<<rebufftime<<endl;
    cout<<"Avg ReBuffering Time: "<<Trebuff<<endl;
    cout<<"Rebuffering Freq: "<<Frebuff<<endl;
    cout<<"Total Time to buffer the video: "<<playertime<<endl;
    float lti , lfr , ltr;
    if(loadtimef>=0 && loadtimef<=1) lti = 1;
    else if(loadtimef>1 && loadtimef<=5) lti = 2;
    else lti = 3;

    if(Frebuff>=0 && Frebuff<=0.02) lfr = 1;
    else if(Frebuff>0.02 && Frebuff<=0.15) lfr = 2;
    else lfr = 3;

    if(Trebuff>=0 && Trebuff<=5) ltr = 1;
    else if(Trebuff>5 && Trebuff<=10) ltr = 2;
    else ltr = 3;

    //cout<<lti<<" "<<lfr<<" "<<ltr<<endl;
    float mos = 4.23 - 0.0672*lti - 0.742*lfr - 0.106*ltr;
    cout<<"MOS: "<<mos<<endl;
  }

  else cout << "Unable to open file"; 

  return 0;
}