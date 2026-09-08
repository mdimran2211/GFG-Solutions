class Solution {
    public ArrayList<ArrayList<Integer>> transpose(int[][] mat) {
        // code here
        
        ArrayList<ArrayList<Integer>> trans = new ArrayList<>();
        for(int i =0; i<mat.length; i++){
            trans.add(new ArrayList<>());
            
            
        }
        for(int i=0; i<mat.length; i++){
            for(int j=0; j<mat.length; j++){
                trans.get(j).add(mat[i][j]);
            }
        }
        return trans;
    }
}
