// ES6 or Vanilla JavaScript

const imageButton = document.querySelector('.nhsuk-problem-image-button')
const imageDialog = document.querySelector('.nhsuk-problem-image-dialog')
const closeButton = document.querySelector('.nhsuk-problem-image-dialog__close')
const dialogImage = document.querySelector('.nhsuk-problem-image-dialog img')

if (imageButton && imageDialog && closeButton && dialogImage) {
	const openImageDialog = () => {
		imageDialog.hidden = false
		imageButton.setAttribute('aria-expanded', 'true')
		closeButton.focus()
	}

	const closeImageDialog = () => {
		imageDialog.hidden = true
		imageButton.setAttribute('aria-expanded', 'false')
		imageButton.focus()
	}

	imageButton.addEventListener('click', openImageDialog)
	closeButton.addEventListener('click', closeImageDialog)
	dialogImage.addEventListener('click', closeImageDialog)

	imageDialog.addEventListener('click', (event) => {
		if (event.target === imageDialog) {
			closeImageDialog()
		}
	})

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && !imageDialog.hidden) {
			closeImageDialog()
		}
	})
}

const tabs = document.querySelector('.nhsuk-tabs')

if (tabs) {
	const tabButtons = Array.from(tabs.querySelectorAll('[role="tab"]'))
	const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'))

	const showTab = (selectedTab) => {
		tabButtons.forEach((tab) => {
			const isSelected = tab === selectedTab
			tab.setAttribute('aria-selected', String(isSelected))
			tab.tabIndex = isSelected ? 0 : -1
		})

		tabPanels.forEach((panel) => {
			panel.hidden = panel.getAttribute('aria-labelledby') !== selectedTab.id
		})
	}

	tabButtons.forEach((tab) => {
		tab.addEventListener('click', (event) => {
			event.preventDefault()
			showTab(tab)
		})
	})
}

const kiosk = document.querySelector('.kiosk-wireframe')

if (kiosk) {
	const kioskTabs = Array.from(kiosk.querySelectorAll('.kiosk-wireframe__tab'))
	const kioskCards = Array.from(kiosk.querySelectorAll('.kiosk-wireframe__card'))
	const kioskPrices = Array.from(kiosk.querySelectorAll('.kiosk-wireframe__prices div'))
	const cancelButton = kiosk.querySelector('.kiosk-wireframe__cancel')
	const nextSelectionButton = kiosk.querySelector('.kiosk-wireframe__next-selection')
	const addItemButton = kiosk.querySelector('.kiosk-wireframe__add-item')
	const makePaymentButton = kiosk.querySelector('.kiosk-wireframe__make-payment')
	const selectionName = kiosk.querySelector('.kiosk-wireframe__selection-name')
	const selectionPrice = kiosk.querySelector('.kiosk-wireframe__selection-price')
	const addedItems = kiosk.querySelector('.kiosk-wireframe__added-items')
	const totalPrice = kiosk.querySelector('.kiosk-wireframe__summary-total strong')
	const paymentSuccess = kiosk.querySelector('.kiosk-wireframe__payment-success')

	const getItemName = (categoryName) => {
		if (categoryName === 'Breakfast') {
			return categoryName
		}

		return categoryName.endsWith('s') ? categoryName.slice(0, -1) : categoryName
	}

	const updateKioskCards = (categoryName) => {
		const itemName = getItemName(categoryName)

		kioskCards.forEach((card, index) => {
			card.textContent = `${itemName} ${index + 1}`
		})
	}

	const updateSelectionSummary = (selectedIndex) => {
		kioskCards.forEach((card, index) => {
			card.classList.toggle('active', index === selectedIndex)
		})

		if (selectionName && selectionPrice && totalPrice) {
			selectionName.textContent = kioskCards[selectedIndex].textContent
			selectionPrice.textContent = kioskPrices[selectedIndex].textContent
		}
	}

	kioskCards.forEach((card, index) => {
		card.addEventListener('click', () => {
			updateSelectionSummary(index)
		})
	})

	kioskTabs.forEach((tab) => {
		tab.addEventListener('click', () => {
			updateKioskCards(tab.textContent.trim())
			const selectedIndex = kioskCards.findIndex((card) => card.classList.contains('active'))
			updateSelectionSummary(selectedIndex)

			kioskTabs.forEach((otherTab) => {
				const isSelected = otherTab === tab
				otherTab.classList.toggle('active', isSelected)
				otherTab.setAttribute('aria-selected', String(isSelected))
			})
		})
	})

	if (nextSelectionButton) {
		nextSelectionButton.addEventListener('click', () => {
			const selectedIndex = kioskCards.findIndex((card) => card.classList.contains('active'))
			const nextIndex = (selectedIndex + 1) % kioskCards.length

			updateSelectionSummary(nextIndex)
		})
	}

	if (addItemButton && addedItems) {
		addItemButton.addEventListener('click', () => {
			const item = document.createElement('div')
			const itemPrice = selectionPrice.textContent.trim()

			item.className = 'kiosk-wireframe__added-item'
			item.innerHTML = `<span>${selectionName.textContent}</span><span>${itemPrice}</span>`
			addedItems.appendChild(item)

			const currentTotal = Number.parseFloat(totalPrice.textContent.replace('£', ''))
			const addedPrice = Number.parseFloat(itemPrice.replace('£', ''))
			totalPrice.textContent = `£${(currentTotal + addedPrice).toFixed(2)}`
		})
	}

	if (cancelButton) {
		cancelButton.addEventListener('click', () => {
			addedItems.replaceChildren()
			selectionName.textContent = 'No items selected'
			selectionPrice.textContent = '£0.00'
			totalPrice.textContent = '£0.00'
			paymentSuccess.hidden = true
		})
	}

	if (makePaymentButton && paymentSuccess) {
		makePaymentButton.addEventListener('click', () => {
			paymentSuccess.hidden = false
		})
	}
}
