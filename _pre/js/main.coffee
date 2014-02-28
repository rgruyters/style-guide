html = document.getElementsByTagName("html")[0];

vpu = document.createElement 'div'
document.body.appendChild vpu

vpu.style.width = "100vw"

if vpu.offsetWidth is window.innerWidth
  # Supported
  html.className += " js-vpu"
else
  # Not Supported
  html.className += " js-no-vpu"

vpu.remove()

# window.fitText(document.getElementsByTagName 'h1')