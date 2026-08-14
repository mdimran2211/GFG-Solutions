import math
class Solution:
    def isPrime(self, n):
        # code here
        count = 0
        for i in range(1, round(math.sqrt(n))+1):
            if n%i == 0:
                count += 1
                if n//i != i:
                    count += 1
        if count == 2:
            return True
        else:
            return False
