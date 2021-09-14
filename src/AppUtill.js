export const downloadResponseCSV = (data, name) => {
  const url = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${name}.csv`) // or any other extension
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
