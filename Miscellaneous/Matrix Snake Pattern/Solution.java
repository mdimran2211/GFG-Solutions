class Solution {
    static ArrayList<Integer> snakePattern(int matrix[][]) {
        // code here
        ArrayList<Integer> ans = new ArrayList<>();
        int n = matrix.length;
        for(int i =0; i<n; i++){
            if(i%2==0){
                for(int j=0; j<n; j++){
                    ans.add(matrix[i] [j]);
                    
                }
                
            }
            else{
                for(int j = n-1; j>=0; j--){
                    ans.add(matrix[i] [j]);
                }
                
            }
        
        }
        return ans;
        
    }
}
