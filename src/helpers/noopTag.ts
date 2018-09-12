
export default function taggedTemplateNoop (strings: TemplateStringsArray, ...keys: any[]) {
  const lastIndex = strings.length - 1
  return strings
    .slice(0, lastIndex)
    .reduce((p, s, i) => p + s + keys[i], '')
    + strings[lastIndex]
}
