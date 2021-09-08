export async function getHtml(
  fileName: string,
  selector: string,
): Promise<HTMLElement> {
  const path = `${window.location.protocol}//${window.location.host}/assets/html/${fileName}.html`
  const response = await fetch(path)
  const blob = await response.blob()
  const text = await blob.text()

  const html = document.createElement(selector)
  html.innerHTML = text.split('</head>')[1]

  return html
}
