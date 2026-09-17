class Solution {
    public boolean areIsomorphic(String s1, String s2) {
        // code here
        if(s1.length()!=s2.length()){
            return false;
        }
        int[] m1 = new int[256];
        int[] m2 = new int[256];
        for(int i=0; i<s1.length(); i++){
            char a = s1.charAt(i);
            char b = s2.charAt(i);
            if(m1[a] != m2[b]){
                return false;
            }
            m1[a] = i+1;
            m2[b] = i+1;
        }
        return true;
    }
}
