class CarteKiwi {
	
	constructor(container) {

    this.fontFamily = 'PhontPhreaks Handwriting'
    this.fontColor = '#665FB2'
    
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
  
  get fontSizeMedium() {
    return this.height * 0.10
  }
  
  get fontSizeSmall() {
    return this.height * 0.08
  }
	
  /**
   * Dessiner la carte et ce qui va dessus
   */
  draw(timestamp) {
    
    this.ctx.clearRect(0, 0, this.width, this.height)
    
    this.ctx.drawImage(
      this.picture,
      0, 0,
      this.picture.width, this.picture.height,
      this.width * 0.62, this.height * 0.11,
      this.width * (0.98 - 0.62), this.height * (0.77 - 0.11)
    )
    
    this.ctx.drawImage(this.image, 0, 0)
    
    this.handwriteText(this.name, 0.18, 0.94, this.fontSizeMedium)
    this.handwriteText(this.dateStart, 0.50, 0.84, this.fontSizeSmall)
    this.handwriteText(this.dateEnd, 0.77, 0.84, this.fontSizeSmall)
          
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