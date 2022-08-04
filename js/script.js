window.addEventListener('DOMContentLoaded', () => {
	//Tabs
	const tabs = document.querySelectorAll('.tabheader__item'),
		tabsContent = document.querySelectorAll('.tabcontent'),
		tabsParent = document.querySelector('.tabheader__items');

	//Скрываем ненужные нам табы.

	function hideTabContent() {
		tabsContent.forEach((item) => {
			item.classList.add('hide');
			item.classList.remove('show', 'fade');
		});

		//Когда мы скрываем табы, также нужно удалить класс активности.

		tabs.forEach((item) => {
			item.classList.remove('tabheader__item_active');
		});
	}

	//Теперь создаем функцию, которая, наоборот, показывает табы, по умолчанию i ставим равным 0. Это стандарт ES6.

	function showTabContent(i = 0) {
		tabsContent[i].classList.add('show', 'fade');
		tabsContent[i].classList.remove('hide');

		//Не забываем добавить класс активности на выбранный заголовок.

		tabs[i].classList.add('tabheader__item_active');
	}

	hideTabContent();
	showTabContent();

	// Используем делегирование событий, чтобы навесить событие клика на родительский элемент, обязательно передаём объект-событие event.

	tabsParent.addEventListener('click', (event) => {
		const target = event.target;
		if (target && target.matches('.tabheader__item')) {
			tabs.forEach((item, i) => {
				//Если тот элемент, в который мы кликнули, будет совпадать с элементом, который мы сейчас перебираем в цикле forEach, мы вызываем две наши функции.
				if (target === item) {
					hideTabContent();
					showTabContent(i);
				}
			});
		}
	});

	//Timer

	const deadline = '2022-08-08';

	//Создаем функцию, которая определяет разницу между дедлайном и текущим временем. Задача этой функции - получить разницу между датами.

	function getTimeRemaining(endtime) {
		let days, hours, minutes, seconds;
		const t = Date.parse(endtime) - Date.parse(new Date());

		if (t <= 0) {
			days = 0;
			hours = 0;
			minutes = 0;
			seconds = 0;
		} else {
			(days = Math.floor(t / (1000 * 60 * 60 * 24))),
				(hours = Math.floor((t / (1000 * 60 * 60)) % 24)),
				(minutes = Math.floor((t / 1000 / 60) % 60)),
				(seconds = Math.floor((t / 1000) % 60));
		}

		return {
			total: t,
			days: days,
			hours: hours,
			minutes: minutes,
			seconds: seconds,
		};
	}

	//Добавляем ноль перед числом, которое меньше 10.

	function getZero(num) {
		if (num >= 0 && num < 10) {
			return `0${num}`;
		} else {
			return num;
		}
	}

	//Создаем функцию, которая будет устанавливать наш таймер уже непосредственно на страничку.

	function setClock(selector, endtime) {
		const timer = document.querySelector(selector),
			days = timer.querySelector('#days'),
			hours = timer.querySelector('#hours'),
			minutes = timer.querySelector('#minutes'),
			seconds = timer.querySelector('#seconds'),
			timeInterval = setInterval(updateClock, 1000);

		updateClock();

		//Создаем еще одну функцию, которая будет обновлять наш таймер каждую секунду.

		function updateClock() {
			const t = getTimeRemaining(endtime); //Разница между панируемым и текущим врменем.
			//Помещаем расчетные величины на страницу.
			days.innerHTML = getZero(t.days);
			hours.innerHTML = getZero(t.hours);
			minutes.innerHTML = getZero(t.minutes);
			seconds.innerHTML = getZero(t.seconds);

			if (t.total <= 0) {
				clearInterval(timeInterval);
			}
		}
	}

	setClock('.timer', deadline);

	//Modal

	const modalTrigger = document.querySelectorAll('[data-modal]'),
		modal = document.querySelector('.modal');

	function openModal() {
		modal.classList.add('show');
		modal.classList.remove('hide');
		document.body.style.overflow = 'hidden'; //Фиксируем страницу, чтобы она не скроллилась
		// при открытом модальном окне.
		clearInterval(modalTimerId);
	}

	modalTrigger.forEach((btn) => {
		btn.addEventListener('click', openModal);
	});

	//Создаем отдельную функцию для закрытия модального окна, чтобы не повторять код.

	function closeModal() {
		modal.classList.add('hide');
		modal.classList.remove('show');
		document.body.style.overflow = '';
	}

	//Реализуем функционал, чтобы модальное окно закрывалось при клике на "подложку" или нажатии на клавишу Esc.

	modal.addEventListener('click', (e) => {
		const target = e.target;
		if (
			(target && target.matches('.modal')) ||
			target.getAttribute('data-close') === ''
		) {
			closeModal();
		}
	});

	//Делаем так, чтобы модальное окно закрывалось с помощью нажатия Esc.

	document.addEventListener('keydown', (e) => {
		if (e.code === 'Escape' && modal.classList.contains('show')) {
			closeModal();
		}
	});

	//Модальное окно появляется, когда пользователь прокрутил страницу до конца.

	const modalTimerId = setTimeout(openModal, 50000);

	function showModalByScroll() {
		if (
			window.pageYOffset + document.documentElement.clientHeight >=
			document.documentElement.scrollHeight - 1
		) {
			openModal();
			window.removeEventListener('scroll', showModalByScroll);
		}
	}

	window.addEventListener('scroll', showModalByScroll);

	//Menu Items

	//Для создания карточек используем классы.

	class MenuCard {
		constructor(src, alt, title, descr, price, parentSelector, ...classes) {
			this.src = src;
			this.alt = alt;
			this.title = title;
			this.descr = descr;
			this.price = price;
			this.classes = classes;
			this.parent = document.querySelector(parentSelector);
			this.transfer = 27;
			this.changeToUAH();
		}

		changeToUAH() {
			this.price = this.price * this.transfer; //Конвертируем стоимость в гривны.
		}

		//С помощью метода render() создаем структуру, которая помещается в определенный div.
		render() {
			const element = document.createElement('div');
			if (this.classes.length === 0) {
				this.element = 'menu__item';
				element.classList.add(this.element);
			} else {
				this.classes.forEach((className) =>
					element.classList.add(className)
				);
			}

			element.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
            `;
			this.parent.append(element);
		}
	}

	//Создаем функцию для получения данных с сервера.

	const getResourse = async (url) => {
		const res = await fetch(url);

		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status ${res.status}`);
		}
		return await res.json();
	};

	getResourse('http://localhost:3000/menu').then((data) => {
		data.forEach(({ img, altimg, title, descr, price }) => {
			new MenuCard(
				img,
				altimg,
				title,
				descr,
				price,
				'.menu .container'
			).render(); //Этот конструктор будет создаваться столько раз, сколько объектов внутри массива menu.
		});
	});

	//Forms

	const forms = document.querySelectorAll('form');

	const message = {
		loading: 'img/form/spinner.svg',
		success: 'Спасибо, скоро мы свяжемся с вами!',
		failure: 'Oops! Что-то пошло не так...',
	};

	forms.forEach((item) => {
		bindPostData(item);
	});

	//Создаем отдельную функцию для общения с сервером с помощью fuction Expression.

	const postData = async (url, data) => {
		//Когда мы вызываем функцию postData, мы передаем в качестве аргумента url, который передается дальше в fetch. И также нам надо передать data, то есть, данные, которые будут поститься в этой функции.
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
			body: data,
		});

		return await res.json();
	};

	//Создаем функцию, которая будет отвечать за постинг данных.

	function bindPostData(form) {
		form.addEventListener('submit', (e) => {
			//Перезагрузка страницы при отправке формы - стандартное поведение браузера. Необходимо убрать это поведение.
			e.preventDefault();

			const statusMessage = document.createElement('img');
			statusMessage.src = message.loading;
			statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;

			form.insertAdjacentElement('afterend', statusMessage);

			const formData = new FormData(form);

			//Сначала превращаем formData в массив массивов с помощью метода entries(), после этого превращаем ее в классический объект, потом этот объект превращаем в JSON.
			const json = JSON.stringify(Object.fromEntries(formData.entries()));

			postData('http://localhost:3000/requests', json)
				.then((data) => {
					//data - это те данные, которые нам возвращаются из промиса, с сервера
					console.log(data);
					showThanksModal(message.success);
					form.reset();
					statusMessage.remove();
				})
				.catch(() => {
					showThanksModal(message.failure);
				})
				.finally(() => {
					form.reset();
				});
		});
	}

	//Создаем красивое оповещение пользователя

	function showThanksModal(message) {
		const previousModalDialog = document.querySelector('.modal__dialog');

		previousModalDialog.classList.add('hide'); //Скрываем элемент при помощи стилей.

		//Теперь нам нужно снова открыть модельное окно и вручную сформировать структуру внутри.
		openModal();

		//Создаем блок-обертку.
		const thanksModal = document.createElement('div');
		thanksModal.classList.add('modal__dialog');

		//Теперь переходим к формированию верстки в этом модальном окне.
		thanksModal.innerHTML = `
            <div class='modal__content'>
                <div class='modal__close' data-close>×</div>
                <div class='modal__title'>${message}</div>
            </div>
        `;

		document.querySelector('.modal').append(thanksModal); //Размещаем элемент на странице.

		//Реализуем функционал, чтобы блок в модалке исчезал, и пользователь снова мог ввести свои данные в модальном окне.
		setTimeout(() => {
			thanksModal.remove();
			previousModalDialog.classList.add('show');
			previousModalDialog.classList.remove('hide');
			closeModal();
		}, 4000);
	}

	fetch('http://localhost:3000/menu')
		.then((data) => data.json()) //Берем data - ответ от сервера и превращаем в обычный JS-объект.
		.then((res) => console.log(res));

	//Slider

	const slides = document.querySelectorAll('.offer__slide'), //Количество слайдов на странице.
		slider = document.querySelector('.offer__slider'),
		prev = document.querySelector('.offer__slider-prev'),
		next = document.querySelector('.offer__slider-next'),
		total = document.querySelector('#total'), //Количество слайдов.
		current = document.querySelector('#current'), //Текущий слайд.
		slidesWrapper = document.querySelector('.offer__slider-wrapper'),
		slidesField = document.querySelector('.offer__slider-inner'), //Внутренняя обертка.
		width = window.getComputedStyle(slidesWrapper).width;

	let slideIndex = 1; //Определяет текущее положение в слайдере.
	let offset = 0; //Определяет отступ вправо или влево, чтобы показывать слайд.

	if (slides.length < 10) {
		total.textContent = `0${slides.length}`;
		current.textContent = `0${slideIndex}`;
	} else {
		total.textContent = slides.length;
		current.textContent = slideIndex;
	}

	slidesField.style.width = 100 * slides.length + '%';
	slidesField.style.display = 'flex';
	slidesField.style.transition = '0.5s all';

	slidesWrapper.style.overflow = 'hidden';

	slides.forEach((slide) => {
		slide.style.width = width;
	});

	slider.style.position = 'relative';

	const indicators = document.createElement('ol'), //Создаем большую обертку для всех точек на сладере и стилизуем ее.
		dots = [];
	indicators.classList.add('carousel-indicators');
	indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
	slider.append(indicators);

	for (let i = 0; i < slides.length; i++) {
		const dot = document.createElement('li');
		dot.setAttribute('data-slide-to', i + 1);
		dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;

		if (i === 0) {
			dot.style.opacity = 1;
		}

		indicators.append(dot);
		dots.push(dot);
	}

	next.addEventListener('click', () => {
		if (
			offset ===
			+width.slice(0, width.length - 2) * (slides.length - 1)
		) {
			offset = 0;
		} else {
			offset += +width.slice(0, width.length - 2); //Когда мы нажимаем стрелочку "вперед", к offset добавляется ширина еще одного слайда.
		}

		slidesField.style.transform = `translateX(-${offset}px)`;

		if (slideIndex === slides.length) {
			slideIndex = 1;
		} else {
			slideIndex++;
		}

		if (slides.length < 10) {
			current.textContent = `0${slideIndex}`;
		} else {
			current.textContent = slideIndex;
		}

		dots.forEach((dot) => (dot.style.opacity = '.5'));
		dots[slideIndex - 1].style.opacity = 1;
	});

	prev.addEventListener('click', () => {
		if (offset === 0) {
			offset = +width.slice(0, width.length - 2) * (slides.length - 1);
		} else {
			offset -= +width.slice(0, width.length - 2); //Когда мы нажимаем стрелочку "вперед", к offset добавляется ширина еще одного слайда.
		}

		slidesField.style.transform = `translateX(-${offset}px)`;

		if (slideIndex === 1) {
			slideIndex = slides.length;
		} else {
			slideIndex--;
		}

		if (slides.length < 10) {
			current.textContent = `0${slideIndex}`;
		} else {
			current.textContent = slideIndex;
		}

		dots.forEach((dot) => (dot.style.opacity = '.5'));
		dots[slideIndex - 1].style.opacity = 1;
	});

	dots.forEach((dot) => {
		dot.addEventListener('click', (e) => {
			const target = e.target;
			const slideTo = target.getAttribute('data-slide-to');

			slideIndex = slideTo;
			offset = +width.slice(0, width.length - 2) * (slideTo - 1);
			slidesField.style.transform = `translateX(-${offset}px)`;

			if (slides.length < 10) {
				current.textContent = `0${slideIndex}`;
			} else {
				current.textContent = slideIndex;
			}

			dots.forEach((dot) => (dot.style.opacity = '.5'));
			dots[slideIndex - 1].style.opacity = 1;
		});
	});
});
