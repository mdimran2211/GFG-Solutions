class Solution {
    public int minSubarraySum(int[] arr) {
        // code here
        int sum = 0;
        int minsum = Integer.MAX_VALUE;
        for(int i =0; i<arr.length;i++)  {
            sum = Math.min(arr[i], sum+arr[i]);
            minsum = Math.min(minsum, sum);
        }
        return minsum;
    }
}
