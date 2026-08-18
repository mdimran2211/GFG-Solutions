class Solution {
    int factorial(int n) {
        // code here
        int result = 1;
        for(int i=1; i<=n; i++){
            result = result*i;
        }
        return result;
    }
    
}
