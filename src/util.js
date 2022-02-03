export function clamp(l, n, u) {
    if (n < l) return l;
    else if (n > u) return u;
    else return n;
  }
  