class CarteKiwi {
	
	constructor(container) {

    this.fontFamily = 'PhontPhreaks Handwriting'
    this.fontColor = '#1F0AFF'
    
    this.container = container
    this.canvas = this.container.querySelector('canvas')
    this.ctx = this.canvas.getContext('2d')
    
    this.inputName = this.container.querySelector('input[name="name"]')
    this.inputDateStart = this.container.querySelector('input[name="dateStart"]')
    this.inputDateEnd = this.container.querySelector('input[name="dateEnd"]')
    
    // Image de fond
    this.image = new Image
    this.image.src = 'carte-kiwi.png'
    this.image.addEventListener('load', () => {
      this.width = this.canvas.width = this.image.width
      this.height = this.canvas.height = this.image.height
    })
    
    // Photo par défaut
    this.picture = new Image
    this.picture.src = 'photo.png'
    
    // Gestion du drag n drop
    this.container.addEventListener('dragover', this.handleDragOver.bind(this))
    this.container.addEventListener('drop', this.handleDrop.bind(this))
	}
  
  get name() {
    return this.inputName.value
  }
  
  get dateStart() {
    return this.inputDateStart.value
  }
  
  get dateEnd() {
    return this.inputDateEnd.value
  }
  
  get fontSizeName() {
    return this.height * 0.10
  }
  
  get fontSizeDate() {
    return this.height * 0.10
  }
	
  /**
   * Dessiner la carte et ce qui va dessus
   */
  draw(timestamp) {
    
    this.ctx.clearRect(0, 0, this.width, this.height)
    
    const dx = this.width * 0.62
    const dy = this.height * 0.11
    const dw = this.width * (0.98 - 0.62)
    const dh = this.height * (0.77 - 0.11)
    const ratio = dw / dh
    
    let sx = 0, sy = 0
    let sw = this.picture.width
    let sh = this.picture.height
    
    if (this.picture.width < this.picture.height) {
      sh = sw * (dh / dw)
      sy = this.picture.height / 2 - sh / 2
    }
    else {
      sw = sh * (dw / dh)
      sx = this.picture.width / 2 - sw / 2
    }
    
    this.ctx.drawImage(
      this.picture,
      sx, sy,
      sw, sh,
      dx, dy,
      dw, dh
    )
    
    this.ctx.drawImage(this.image, 0, 0)
    
    this.handwriteText(this.name, 0.18, 0.94, this.fontSizeName)
    this.handwriteText(this.dateStart, 0.50, 0.84, this.fontSizeDate)
    this.handwriteText(this.dateEnd, 0.77, 0.84, this.fontSizeDate)
          
    requestAnimationFrame(this.draw.bind(this))
  }
  
  /**
   * Écrire du texte
   * @param
   */
  handwriteText(text, px, py, size = 40) {
    const x = this.width * px
    const y = this.height * py

    this.ctx.save()
    
    this.ctx.font = `${size}px "${this.fontFamily}", cursive`
    this.ctx.fillStyle = this.fontColor
    this.ctx.globalCompositeOperation = 'multiply'
    
    this.ctx.translate(x, y)
    this.ctx.fillText(text, 0, 0)
    
    this.ctx.globalAlpha = '0.3'
    
    for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
      this.ctx.fillText(text, Math.cos(i) * 1.5, Math.sin(i) * 1.5)
    }
    
    this.ctx.restore()
  }
  
  /**
   * Gérer le hover du drag n drop
   */
   handleDragOver(event) {
    event.stopPropagation()
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }
  
  /**
   * Gérer le drop
   */
   handleDrop(event) {
    event.stopPropagation()
    event.preventDefault()

    var files = event.dataTransfer.files
    
    for (let i = 0, f; f = files[i]; i++) {
      
      if (!f.type.match('image.*')) {
        continue
      }

      var reader = new FileReader()
      
      reader.addEventListener('load', (event) => {
        this.picture = new Image
        this.picture.src = event.target.result
      })
      
      reader.readAsDataURL(f)
      break
    }
  }
}