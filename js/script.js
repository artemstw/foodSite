window.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tabheader__item'),
    tabsContent = document.querySelectorAll('.tabcontent'),
    tabsParent = document.querySelector('.tabheader__items');

    //Скрываем ненужные нам табы.

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        //Когда мы скрываем табы, также нужно удалить класс активности.

        tabs.forEach(item => {
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

    // Используем делегирование событий, чтобы навесить событие клика на родительский элемент,
    // обязательно передаём объект-событие event.

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;
        if (target && target.matches('.tabheader__item')) {
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
});
