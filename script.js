const myths = {
    lupercalia: {
        title: 'Луперкалии → День Валентина',
        text: 'Между запретом Луперкалий (496 год) и появлением романтических ассоциаций с 14 февраля прошло более 700 лет. Документов о «замене» праздника нет — это версия кардинала Барониуса XVI века.'
    },
    secret: {
        title: 'Тайные венчания солдат',
        text: 'Историк Джордж Монджер показал, что запрет на браки солдат, приписываемый Клавдию II, вероятно, никогда не издавался. Легенда появилась задним числом.'
    },
    letter: {
        title: 'Письмо «От твоего Валентина»',
        text: 'Фраза «От твоего Валентина» не встречается в ранних источниках и является изобретением XVIII века, отражающим уже сложившуюся романтическую традицию.'
    },
    calendar: {
        title: 'Папа заменил праздник',
        text: 'Папа Геласий I запретил Луперкалии, но не учреждал День Валентина как замену. Эта связь не подтверждается ранними источниками.'
    }
};

const timelineEvents = [
    {
        year: '269 год',
        title: 'Казнь святого Валентина',
        text: 'На Фламиниевой дороге в Риме казнён мученик Валентин; его культ фиксируется уже в IV веке.'
    },
    {
        year: '1382 год',
        title: 'Чосер и «Парламент птиц»',
        text: 'Первая документальная связь 14 февраля и романтической любви в английской поэзии.'
    },
    {
        year: '1415 год',
        title: 'Старинная валентинка',
        text: 'Карл Орлеанский пишет жене стихотворение в плену — самая ранняя сохранившаяся валентинка.'
    },
    {
        year: '1840 год',
        title: 'Пенни-почта',
        text: 'Реформа почты в Британии делает отправку открыток массовой и дешёвой.'
    },
    {
        year: '1868 год',
        title: 'Коробки конфет Кэдбери',
        text: 'Сердцевидные коробки закрепляют связь праздника с шоколадом.'
    },
    {
        year: '1913 год',
        title: 'Первая валентинка Hallmark',
        text: 'Начало промышленного производства открыток в США.'
    },
    {
        year: '1990-е',
        title: 'Возвращение в Россию',
        text: 'Праздник закрепляется в медиа, рекламе и молодёжной культуре.'
    },
    {
        year: '2025 год',
        title: 'Исторический минимум популярности',
        text: 'Только 27% россиян считают праздник «настоящим».'
    }
];

const countries = {
    japan: {
        title: 'Япония',
        text: 'С 1970-х женщины дарят мужчинам шоколад. Через месяц — 14 марта — мужчины отвечают подарками в Белый день.'
    },
    brazil: {
        title: 'Бразилия',
        text: 'День влюблённых отмечают 12 июня, в канун дня святого Антония — покровителя брака.'
    },
    finland: {
        title: 'Финляндия',
        text: '14 февраля — «День дружбы», где поздравляют не только пары, но и друзей.'
    },
    korea: {
        title: 'Южная Корея',
        text: 'Существует календарь любовных дат: 14 февраля, Белый день 14 марта и Чёрный день 14 апреля.'
    }
};

const eras = {
    imperial: 'О празднике упоминали в контексте дворянских развлечений, но документальных подтверждений нет: источники ссылаются друг на друга.',
    soviet: 'В СССР праздник был фактически неизвестен: западное происхождение и религиозное содержание делали его невозможным для массовой культуры.',
    post: 'В 1990-х и 2000-х отмечался подъём, но к 2020-м популярность снизилась до исторического минимума.'
};

const initMythSwitcher = () => {
    const buttons = document.querySelectorAll('#mythButtons .pill');
    const title = document.getElementById('mythTitle');
    const text = document.getElementById('mythText');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const key = button.dataset.myth;
            title.textContent = myths[key].title;
            text.textContent = myths[key].text;
        });
    });
};

const initTimeline = () => {
    const range = document.getElementById('timelineRange');
    const year = document.getElementById('timelineYear');
    const title = document.getElementById('timelineTitle');
    const text = document.getElementById('timelineText');
    const dotsContainer = document.getElementById('timelineDots');

    timelineEvents.forEach(event => {
        const dot = document.createElement('span');
        dot.className = 'timeline-dot';
        dot.textContent = event.year;
        dotsContainer.appendChild(dot);
    });

    const updateTimeline = (index) => {
        const event = timelineEvents[index];
        year.textContent = event.year;
        title.textContent = event.title;
        text.textContent = event.text;
    };

    range.addEventListener('input', (event) => {
        updateTimeline(Number(event.target.value));
    });

    updateTimeline(0);
};

const initTabs = () => {
    const buttons = document.querySelectorAll('#countryTabs .tab');
    const title = document.getElementById('countryTitle');
    const text = document.getElementById('countryText');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const key = button.dataset.country;
            title.textContent = countries[key].title;
            text.textContent = countries[key].text;
        });
    });
};

const initEraSelector = () => {
    const buttons = document.querySelectorAll('#eraButtons .pill');
    const text = document.getElementById('eraText');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            text.textContent = eras[button.dataset.era];
        });
    });
};

const initNavHighlight = () => {
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(section => observer.observe(section));
};

window.addEventListener('DOMContentLoaded', () => {
    initMythSwitcher();
    initTimeline();
    initTabs();
    initEraSelector();
    initNavHighlight();
});
