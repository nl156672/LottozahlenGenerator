// Fallback JS generator used if WASM not built.
export function generateLottoJS() {
  // Try until a valid combination is produced
  for (let attempt = 0; attempt < 50; attempt++) {
    const set = new Set();
    while (set.size < 6) {
      const v = Math.floor(Math.random() * 49) + 1;
      set.add(v);
    }
    let nums = Array.from(set).sort((a,b)=>a-b);
    if (!nums.some(n => n > 31)) {
      const idx = Math.floor(Math.random() * 6);
      nums[idx] = Math.floor(Math.random() * 18) + 32; // 32..49
      nums = nums.sort((a,b)=>a-b);
    }
    const superzahl = Math.floor(Math.random() * 10);
    if (isValidCombination(nums)) return {numbers: nums, super: superzahl};
  }
  // Fallback: if nothing valid after many attempts, return a guaranteed valid hand
  const fallback = [3,11,22,29,34,45];
  return {numbers: fallback, super: Math.floor(Math.random()*10)};
}

export function isValidCombination(numbers) {
  if (!Array.isArray(numbers) || numbers.length !== 6) return false;
  const uniq = new Set(numbers);
  if (uniq.size !== 6) return false;
  if (numbers.some(n => n < 1 || n > 49)) return false;
  // avoid long consecutive sequences > 2
  let maxSeq = 1, cur = 1;
  const s = numbers.slice().sort((a,b)=>a-b);
  for (let i=1;i<s.length;i++){
    if (s[i]===s[i-1]+1) { cur++; maxSeq = Math.max(maxSeq, cur); } else { cur =1 }
  }
  if (maxSeq > 2) return false;
  return true;
}
