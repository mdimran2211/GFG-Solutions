class Solution {
    public static int subArraySum(int[] arr, int k) {

        HashMap<Long, Integer> map = new HashMap<>();

        long sum = 0;
        int count = 0;

        map.put(0L, 1);

        for (int num : arr) {

            sum += num;

            if (map.containsKey(sum - k)) {
                count += map.get(sum - k);
            }

            map.put(sum, map.getOrDefault(sum, 0) + 1);
        }

        return count;
    }
}
