document.addEventListener("DOMContentLoaded", () => {
  const screens = document.querySelectorAll(".screen")
  const navButtons = {
    "btn-to-documentos": "screen-documentos",
    "btn-to-dni-front": "screen-dni-front",
    "btn-to-dni-detail": "screen-dni-detail",
    "btn-to-vehiculos": "screen-vehiculos",
    "btn-to-trabajo": "screen-trabajo",
    "btn-to-salud": "screen-salud",
    "btn-to-cobros": "screen-cobros",
    "btn-to-tramites": "screen-tramites",
    "btn-to-turnos": "screen-turnos",
    "btn-to-hijos": "screen-hijos",
  }

  function showScreen(screenId) {
    screens.forEach((screen) => {
      screen.classList.remove("active")
    })
    const activeScreen = document.getElementById(screenId)
    if (activeScreen) {
      activeScreen.classList.add("active")
    }
  }

  // Navigation buttons
  Object.keys(navButtons).forEach((buttonId) => {
    const button = document.getElementById(buttonId)
    if (button) {
      button.addEventListener("click", () => {
        showScreen(navButtons[buttonId])
      })
    }
  })

  // Back arrows
  document.querySelectorAll(".back-arrow").forEach((arrow) => {
    arrow.addEventListener("click", () => {
      const targetScreenId = arrow.getAttribute("data-target")
      showScreen(targetScreenId)
    })
  })

  // DNI Collapsible
  const dniCollapsible = document.getElementById("dni-collapsible")
  if (dniCollapsible) {
    const dniContent = dniCollapsible.querySelector(".document-item-content")
    const dniArrowIcon = dniCollapsible.querySelector(".arrow-icon")

    dniCollapsible.querySelector(".document-item-header").addEventListener("click", () => {
      const isExpanded = dniContent.classList.contains("expanded")
      if (isExpanded) {
        dniContent.classList.remove("expanded")
        dniArrowIcon.innerHTML = "&#9662;"
      } else {
        dniContent.classList.add("expanded")
        dniArrowIcon.innerHTML = "&#9652;"
      }
    })
  }

  // DNI Flip Animation
  const dniFlipperElement = document.getElementById("dni-flipper")
  if (dniFlipperElement) {
    let startX = 0
    let isDragging = false
    let currentRotation = 0
    let screenWidth = window.innerWidth

    const indicatorFront = document.getElementById("indicator-front")
    const indicatorBack = document.getElementById("indicator-back")

    // Update indicators based on rotation
    function updateIndicators() {
      if (Math.abs(currentRotation) > 90) {
        indicatorFront.classList.remove("active")
        indicatorBack.classList.add("active")
      } else {
        indicatorFront.classList.add("active")
        indicatorBack.classList.remove("active")
      }
    }

    // Actualizar el ancho de la pantalla si cambia
    window.addEventListener("resize", () => {
      screenWidth = window.innerWidth
    })

    // Función para aplicar rotación basada en la posición del mouse/dedo
    function applyRotation(diffX) {
      // Calcular el porcentaje de movimiento
      const movePercent = Math.max(0, Math.min(1, Math.abs(diffX) / (screenWidth * 0.3)))

      let targetRotation

      // Si estamos en el frente (0 a -90 grados)
      if (currentRotation >= -90) {
        if (diffX < 0) {
          // Movimiento hacia la izquierda - el extremo derecho pasa por arriba hacia el izquierdo
          targetRotation = -movePercent * 180
        } else {
          // Movimiento hacia la derecha - mantener en frente
          targetRotation = Math.min(0, currentRotation + movePercent * 90)
        }
      } else {
        // Si estamos en el reverso (-90 a -180 grados)
        if (diffX > 0) {
          // Movimiento hacia la derecha - el extremo izquierdo pasa por arriba hacia la derecha
          targetRotation = -180 + movePercent * 180
        } else {
          // Movimiento hacia la izquierda - mantener en reverso
          targetRotation = Math.max(-180, currentRotation - movePercent * 90)
        }
      }

      // Aplicar la rotación
      dniFlipperElement.style.transform = `rotateY(${targetRotation}deg)`
      currentRotation = targetRotation

      updateIndicators()
    }

    // Función para finalizar el deslizamiento
    function finishRotation() {
      // Si pasó la mitad, completar la rotación, sino volver al estado anterior
      if (Math.abs(currentRotation) > 90) {
        dniFlipperElement.style.transition = "transform 0.3s ease-out"
        dniFlipperElement.style.transform = "rotateY(-180deg)"
        currentRotation = -180
      } else {
        dniFlipperElement.style.transition = "transform 0.3s ease-out"
        dniFlipperElement.style.transform = "rotateY(0deg)"
        currentRotation = 0
      }

      updateIndicators()

      // Quitar la transición después de completarla
      setTimeout(() => {
        dniFlipperElement.style.transition = ""
      }, 300)
    }

    // Touch events
    dniFlipperElement.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX
      isDragging = true
      dniFlipperElement.style.transition = ""
    })

    dniFlipperElement.addEventListener("touchmove", (e) => {
      if (!isDragging) return
      e.preventDefault()

      const currentX = e.touches[0].clientX
      const diffX = currentX - startX

      applyRotation(diffX)
    })

    dniFlipperElement.addEventListener("touchend", () => {
      if (!isDragging) return
      isDragging = false
      finishRotation()
    })

    // Mouse events
    dniFlipperElement.addEventListener("mousedown", (e) => {
      e.preventDefault()
      startX = e.clientX
      isDragging = true
      dniFlipperElement.style.transition = ""
    })

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return

      const currentX = e.clientX
      const diffX = currentX - startX

      applyRotation(diffX)
    })

    document.addEventListener("mouseup", () => {
      if (!isDragging) return
      isDragging = false
      finishRotation()
    })

    // Permitir voltear el DNI haciendo clic en los indicadores
    indicatorFront.addEventListener("click", () => {
      dniFlipperElement.style.transition = "transform 0.3s ease-out"
      dniFlipperElement.style.transform = "rotateY(0deg)"
      currentRotation = 0
      updateIndicators()

      setTimeout(() => {
        dniFlipperElement.style.transition = ""
      }, 300)
    })

    indicatorBack.addEventListener("click", () => {
      dniFlipperElement.style.transition = "transform 0.3s ease-out"
      dniFlipperElement.style.transform = "rotateY(-180deg)"
      currentRotation = -180
      updateIndicators()

      setTimeout(() => {
        dniFlipperElement.style.transition = ""
      }, 300)
    })
  }

  // Salud screen scroll reveal animation
  function handleSaludScrollReveal() {
    const saludScreen = document.getElementById("screen-salud")
    if (!saludScreen || !saludScreen.classList.contains("active")) return

    const sections = saludScreen.querySelectorAll(".salud-section")
    const content = saludScreen.querySelector(".content")

    if (!content) return

    const scrollTop = content.scrollTop
    const windowHeight = content.clientHeight

    sections.forEach((section, index) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight

      // Calcular si la sección está visible
      const isVisible = scrollTop + windowHeight > sectionTop + 50

      if (isVisible && !section.classList.contains("visible")) {
        // Agregar un pequeño delay para cada sección
        setTimeout(() => {
          section.classList.add("visible")
        }, index * 100)
      }
    })
  }

  // Turnos screen scroll reveal animation
  function handleTurnosScrollReveal() {
    const turnosScreen = document.getElementById("screen-turnos")
    if (!turnosScreen || !turnosScreen.classList.contains("active")) return

    const sections = turnosScreen.querySelectorAll(".turnos-section")
    const content = turnosScreen.querySelector(".content")

    if (!content) return

    const scrollTop = content.scrollTop
    const windowHeight = content.clientHeight

    sections.forEach((section, index) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight

      // Calcular si la sección está visible
      const isVisible = scrollTop + windowHeight > sectionTop + 50

      if (isVisible && !section.classList.contains("visible")) {
        // Agregar un pequeño delay para cada sección
        setTimeout(() => {
          section.classList.add("visible")
        }, index * 100)
      }
    })
  }

  // Agregar event listener para el scroll en la pantalla de turnos
  document.addEventListener("scroll", handleTurnosScrollReveal, true)

  // Agregar event listener para el scroll en la pantalla de salud
  document.addEventListener("scroll", handleSaludScrollReveal, true)

  // También ejecutar cuando se muestra la pantalla de salud o turnos
  const originalShowScreen = showScreen
  showScreen = (screenId) => {
    originalShowScreen(screenId)

    if (screenId === "screen-salud") {
      // Reset all sections to invisible
      const sections = document.querySelectorAll(".salud-section")
      sections.forEach((section) => {
        section.classList.remove("visible")
      })

      // Trigger reveal animation after a short delay
      setTimeout(() => {
        handleSaludScrollReveal()
      }, 100)
    }

    if (screenId === "screen-turnos") {
      // Reset all sections to invisible
      const sections = document.querySelectorAll(".turnos-section")
      sections.forEach((section) => {
        section.classList.remove("visible")
      })

      // Trigger reveal animation after a short delay
      setTimeout(() => {
        handleTurnosScrollReveal()
      }, 100)
    }
  }

  // Initialize with home screen
  showScreen("screen-home")

  // Service items navigation
  const documentosButton = document.getElementById("btn-to-documentos")
  if (documentosButton) {
    documentosButton.addEventListener("click", () => showScreen("screen-documentos"))
  }

  const vehiculosButton = document.getElementById("btn-to-vehiculos")
  if (vehiculosButton) {
    vehiculosButton.addEventListener("click", () => showScreen("screen-vehiculos"))
  }

  const trabajoButton = document.getElementById("btn-to-trabajo")
  if (trabajoButton) {
    trabajoButton.addEventListener("click", () => showScreen("screen-trabajo"))
  }

  const saludButton = document.getElementById("btn-to-salud")
  if (saludButton) {
    saludButton.addEventListener("click", () => showScreen("screen-salud"))
  }

  const cobrosButton = document.getElementById("btn-to-cobros")
  if (cobrosButton) {
    cobrosButton.addEventListener("click", () => showScreen("screen-cobros"))
  }

  const tramitesButton = document.getElementById("btn-to-tramites")
  if (tramitesButton) {
    tramitesButton.addEventListener("click", () => showScreen("screen-tramites"))
  }

  const turnosButton = document.getElementById("btn-to-turnos")
  if (turnosButton) {
    turnosButton.addEventListener("click", () => showScreen("screen-turnos"))
  }

  const hijosButton = document.getElementById("btn-to-hijos")
  if (hijosButton) {
    hijosButton.addEventListener("click", () => showScreen("screen-hijos"))
  }

  // CAMBIO 2: Funcionalidad para mostrar/ocultar QR
  const qrVerifyButton = document.querySelector(".qr-verify-button")
  const qrCodeDisplay = document.querySelector(".qr-code-display")

  if (qrVerifyButton && qrCodeDisplay) {
    qrVerifyButton.addEventListener("click", (e) => {
      e.preventDefault()

      // Toggle la visibilidad del QR
      qrCodeDisplay.classList.toggle("show")

      // Cambiar la dirección de la flecha
      const arrow = qrVerifyButton.querySelector(".qr-arrow")
      if (qrCodeDisplay.classList.contains("show")) {
        arrow.style.transform = "rotate(-90deg)" // Flecha hacia arriba cuando está abierto
      } else {
        arrow.style.transform = "rotate(90deg)" // Flecha hacia abajo cuando está cerrado
      }
    })
  }

  // Sidebar Menu Functionality
  const menuIcon = document.querySelector(".menu-icon")
  const sidebarBackArrow = document.querySelector(".sidebar-back-arrow")

  function showSidebar() {
    showScreen("screen-sidebar")
  }

  function hideSidebar() {
    showScreen("screen-home")
  }

  // Menu icon click event
  if (menuIcon) {
    menuIcon.addEventListener("click", showSidebar)
  }

  // Sidebar back arrow click event
  if (sidebarBackArrow) {
    sidebarBackArrow.addEventListener("click", hideSidebar)
  }
})
