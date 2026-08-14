class Solution {
  public:
    bool isPalindrome(int n) {
        // code here.
        if(n<0){
            n=n*-1;
        }
        int temp_n=n;
        string str_n=to_string(temp_n);
        int digits=str_n.size();
        int i=0;
        while(i<digits/2){
            if(str_n[i]!=str_n[digits-1-i]){
                return false;
            }
            i++;
        }
        return true;
    }
};
class Solution {
  public:
    bool isPalindrome(int n) {
        // code here.
        if (n<0){
            n=n*-1;
        }
        int temp_n=n;
        int reversed_n=0;
        int digitCount=log10(temp_n)+1;
        while(temp_n>0){
            reversed_n=(reversed_n*10)+temp_n%10;
            temp_n=temp_n/10;
        }
        if(reversed_n==n){
            return true;
        }else{
            return false;
        }
    }
};
