window.addEventListener("DOMContentLoaded", () => {
    //Tabs
    const tabs = document.querySelectorAll(".tabheader__item"),
        tabsContent = document.querySelectorAll(".tabcontent"),
        tabsParent = document.querySelector(".tabheader__items");

    //Скрываем ненужные нам табы.

    function hideTabContent() {
        tabsContent.forEach((item) => {
            item.classList.add("hide");
            item.classList.remove("show", "fade");
        });

        //Когда мы скрываем табы, также нужно удалить класс активности.

        tabs.forEach((item) => {
            item.classList.remove("tabheader__item_active");
        });
    }

    //Теперь создаем функцию, которая, наоборот, показывает табы, по умолчанию i ставим равным 0. Это стандарт ES6.

    function showTabContent(i = 0) {
        tabsContent[i].classList.add("show", "fade");
        tabsContent[i].classList.remove("hide");

        //Не забываем добавить класс активности на выбранный заголовок.

        tabs[i].classList.add("tabheader__item_active");
    }

    hideTabContent();
    showTabContent();

    // Используем делегирование событий, чтобы навесить событие клика на родительский элемент,
    // обязательно передаём объект-событие event.

    tabsParent.addEventListener("click", (event) => {
        const target = event.target;
        if (target && target.matches(".tabheader__item")) {
            tabs.forEach((item, i) => {
                //Если тот элемент, в который мы кликнули, будет совпадать с элементом, который мы сейчас перебираем
                //в цикле forEach, мы вызываем две наши функции.
                if (target === item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    //Timer

    const deadline = "2022-08-08";

    //Создаем функцию, которая определяет разницу между дедлайном и текущим временем.
    //Задача этой функции - получить разницу между датами.

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
            days = timer.querySelector("#days"),
            hours = timer.querySelector("#hours"),
            minutes = timer.querySelector("#minutes"),
            seconds = timer.querySelector("#seconds"),
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

    setClock(".timer", deadline);

    //Modal

    const modalTrigger = document.querySelectorAll("[data-modal]"),
        modal = document.querySelector(".modal"),
        modalCloseBtn = document.querySelector("[data-close]");

    function openModal() {
        modal.classList.add("show");
        modal.classList.remove("hide");
        document.body.style.overflow = "hidden"; //Фиксируем страницу, чтобы она не скроллилась
        // при открытом модальном окне.
        clearInterval(modalTimerId);
    }

    modalTrigger.forEach((btn) => {
        btn.addEventListener("click", openModal);
    });

    //Создаем отдельную функцию для закрытия модального окна, чтобы не повторять код.

    function closeModal() {
        modal.classList.add("hide");
        modal.classList.remove("show");
        document.body.style.overflow = "";
    }

    modalCloseBtn.addEventListener("click", closeModal);

    //Реализуем функционал, чтобы модальное окно закрывалось при клике на "подложку" или нажатии на клавишу Esc.

    modal.addEventListener("click", (e) => {
        const target = e.target;
        if (target && target.matches(".modal")) {
            closeModal();
        }
    });

    //Делаем так, чтобы модальное окно закрывалось с помощью нажатия Esc.

    document.addEventListener("keydown", (e) => {
        if (e.code === "Escape" && modal.classList.contains("show")) {
            closeModal();
        }
    });

    //Модальное окно появляется, когда пользователь прокрутил страницу до конца.

    const modalTimerId = setTimeout(openModal, 8000);

    function showModalByScroll() {
        if (
            window.pageYOffset + document.documentElement.clientHeight >=
            document.documentElement.scrollHeight - 1
        ) {
            openModal();
            window.removeEventListener("scroll", showModalByScroll);
        }
    }

    window.addEventListener("scroll", showModalByScroll);

    //Menu Items

    //Для создания карточек используем классы.

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer; //Конвертируем стоимость в гривны.
        }

        //С помощью метода render() создаем структуру, которая помеается в определенный div.
        render() {
            const element = document.createElement("div");
            element.innerHTML = `
            <div class="menu__item">
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
            </div>
            `;
            this.parent.append(element);
        }
    }

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        "Меню 'Фитнес'",
        "Меню 'Фитнес' - это новый подход к приготовлению блюд: больше свежих овощей и фруктов.Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!",
        9,
        ".menu .container"
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        "Меню 'Премиум'",
        "В меню 'Премиум' мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!",
        14,
        ".menu .container"
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        "Меню 'Постное'",
        "Меню 'Постное' - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.",
        21,
        ".menu .container"
    ).render();
});
