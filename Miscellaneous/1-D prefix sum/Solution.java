class Solution {
    public ArrayList<Integer> prefSum(int[] arr) {
        // code here
        
        ArrayList<Integer> result = new ArrayList<>();
        int sum =0;
        for(int i =0; i<arr.length; i++){
            sum+= arr[i];
            result.add(sum);
        }
        return result;
    }
}
