document.addEventListener('DOMContentLoaded', () => {
    // ... الكود هنا يبقى كما هو حتى نصل إلى دوال الرسوم البيانية ومعالج الوضع الليلي ...
    // --- 1. تحديد العناصر ---
    const elements = { /* ... */ };
    // --- 2. متغيرات الحالة ---
    let timerInterval = null, isTimerRunning = false, currentSessionStartTime = null;
    let allData = {}; 
    let currentDateKey = new Date().toISOString().slice(0, 10);
    let weeklyChartInstance, hourlyChartInstance;

    // --- 3 & 4. دوال البيانات والمساعدة (تبقى كما هي) ---
    const saveData = () => localStorage.setItem('workTrackerData', JSON.stringify(allData));
    const loadData = () => { /* ... كما هو ... */ };
    const formatTime = (date) => { /* ... كما هو ... */ };
    const formatDuration = (ms, withSeconds = true) => { /* ... كما هو ... */ };
    
    // --- 5. تحديث الواجهة (يبقى كما هو) ---
    const renderUIForDate = (dateKey, flashIndex = -1) => { /* ... كما هو ... */ };
    const updateTimerDisplay = () => { /* ... كما هو ... */ };

    // --- 6. الرسوم البيانية (مع تعديل بسيط للألوان) ---
    const renderCharts = () => {
        // نحدد الألوان بناءً على الثيم الحالي
        const isDarkMode = document.documentElement.getAttribute('data-bs-theme') === 'dark';
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const fontColor = isDarkMode ? '#dee2e6' : '#495057';
        
        // تحديث خيارات الألوان العامة في Chart.js
        Chart.defaults.color = fontColor;
        Chart.defaults.borderColor = gridColor;

        renderWeeklyBarChart();
        renderHourlyBreakdownChart();
    };

    function renderWeeklyBarChart() {
        const labels = [];
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateKey = d.toISOString().slice(0, 10);
            labels.push(d.toLocaleDateString('ar-EG', { weekday: 'short' }));
            const daySessions = allData[dateKey] || [];
            const totalMs = daySessions.reduce((sum, s) => sum + (s.end.getTime() - s.start.getTime()), 0);
            data.push((totalMs / (1000 * 60 * 60)).toFixed(2));
        }

        if (weeklyChartInstance) weeklyChartInstance.destroy();
        weeklyChartInstance = new Chart(document.getElementById('weekly-chart'), {
            type: 'bar',
            data: { labels, datasets: [{ label: 'ساعات العمل', data, backgroundColor: 'rgba(0, 123, 255, 0.6)', borderColor: 'rgba(0, 123, 255, 1)', borderWidth: 1 }] },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, title: { display: true, text: 'ساعات' } } } }
        });
    }

    function renderHourlyBreakdownChart() {
        const hourlyTotals = Array(24).fill(0);
        Object.values(allData).flat().forEach(session => {
            let start = session.start;
            let end = session.end;
            for (let hour = start.getHours(); hour <= end.getHours(); hour++) {
                const hourStart = new Date(start).setHours(hour, 0, 0, 0);
                const hourEnd = new Date(start).setHours(hour, 59, 59, 999);
                const overlapStart = Math.max(start, hourStart);
                const overlapEnd = Math.min(end, hourEnd);
                if (overlapEnd > overlapStart) {
                    hourlyTotals[hour] += (overlapEnd - overlapStart) / (1000 * 60);
                }
            }
        });
        
        if (hourlyChartInstance) hourlyChartInstance.destroy();
        hourlyChartInstance = new Chart(document.getElementById('hourly-chart'), {
            type: 'bar',
            data: {
                labels: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
                datasets: [{ label: 'متوسط الدقائق', data: hourlyTotals, backgroundColor: 'rgba(23, 162, 184, 0.6)' }]
            },
            options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, scales: { x: { title: { display: true, text: 'إجمالي الدقائق' } } } }
        });
    }
    
    // --- 7. معالجات الأحداث (مع معالج الوضع الليلي المصحح) ---

    // ... كل المعالجات الأخرى (datePicker, startStopBtn, etc.) تبقى كما هي تماماً ...
    
    // إصلاح منطق الوضع الليلي بالكامل
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-bs-theme', theme);
    };

    document.getElementById('darkModeSwitch').addEventListener('change', (e) => {
        const newTheme = e.target.checked ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
        // نعيد رسم المخططات بعد تغيير الثيم لضمان تحديث الألوان
        // بما أن هذا يحدث مرة واحدة فقط عند التغيير، فلن تحدث حلقة لا نهائية
        renderCharts();
    });

    // --- 8. التشغيل الأولي (مع تعديل بسيط) ---
    const initialize = () => {
        loadData();
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.getElementById('darkModeSwitch').checked = savedTheme === 'dark';
        applyTheme(savedTheme);
        
        const datePicker = document.getElementById('date-picker');
        datePicker.value = currentDateKey;
        datePicker.dispatchEvent(new Event('change')); // لتشغيل العرض لأول مرة
    };

    // هذا الكود الكامل والصحيح. يمكنك نسخ كل ما هو داخل `DOMContentLoaded` واستبداله.
    // ...
    // ملحوظة: لضمان أن الكود الكامل موجود، سأضع هنا المحتوى الكامل للملف مرة أخرى
});

// ==========================================================
// ========== الكود الكامل والنهائي لملف app.js ============
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. تحديد العناصر ---
    const elements = {
        timerDisplay: document.getElementById('timer-display'),
        startStopBtn: document.getElementById('start-stop-btn'),
        manualForm: document.getElementById('manual-form'),
        manualCollapse: new bootstrap.Collapse(document.getElementById('manualCollapse'), { toggle: false }),
        startTimeInput: document.getElementById('start-time'),
        endTimeInput: document.getElementById('end-time'),
        sessionsTableBody: document.getElementById('sessions-table-body'),
        totalHoursDisplay: document.getElementById('total-hours'),
        sessionCountDisplay: document.getElementById('session-count'),
        noSessionsMsg: document.getElementById('no-sessions-msg'),
        clearDataBtn: document.getElementById('clear-data-btn'),
        darkModeSwitch: document.getElementById('darkModeSwitch'),
        datePicker: document.getElementById('date-picker'),
        weeklyChartCanvas: document.getElementById('weekly-chart'),
        hourlyChartCanvas: document.getElementById('hourly-chart'),
    };

    // --- 2. متغيرات الحالة ---
    let timerInterval = null, isTimerRunning = false, currentSessionStartTime = null;
    let allData = {};
    let currentDateKey = new Date().toISOString().slice(0, 10);
    let weeklyChartInstance, hourlyChartInstance;

    // --- 3. دوال التعامل مع البيانات ---
    const saveData = () => localStorage.setItem('workTrackerData', JSON.stringify(allData));
    const loadData = () => {
        const saved = localStorage.getItem('workTrackerData');
        if (saved) {
            allData = JSON.parse(saved);
            Object.keys(allData).forEach(dateKey => {
                allData[dateKey] = allData[dateKey].map(s => ({ start: new Date(s.start), end: new Date(s.end) }));
            });
        }
    };

    // --- 4. دوال مساعدة ---
    const formatTime = (date) => date ? date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: false }) : '---';
    const formatDuration = (ms) => {
        if (ms < 0) ms = 0;
        const s = Math.floor(ms / 1000);
        return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60]
            .map(v => v.toString().padStart(2, '0')).join(':');
    };
    
    // --- 5. دوال تحديث الواجهة ---
    const renderUIForDate = (dateKey) => {
        const sessions = allData[dateKey] || [];
        elements.sessionsTableBody.innerHTML = '';
        let totalMilliseconds = 0;
        sessions.sort((a, b) => a.start - b.start);
        elements.noSessionsMsg.classList.toggle('d-none', sessions.length > 0);

        sessions.forEach((session, index) => {
            const durationMs = session.end.getTime() - session.start.getTime();
            totalMilliseconds += durationMs;
            const row = document.createElement('tr');
            row.innerHTML = `<td>${index + 1}</td><td>${formatTime(session.start)}</td><td>${formatTime(session.end)}</td><td>${formatDuration(durationMs)}</td><td class="text-center"><button class="btn btn-sm btn-outline-danger delete-btn" data-index="${index}" title="حذف"><i class="bi bi-trash3"></i></button></td>`;
            elements.sessionsTableBody.appendChild(row);
        });

        elements.totalHoursDisplay.textContent = formatDuration(totalMilliseconds);
        elements.sessionCountDisplay.textContent = sessions.length;
        renderCharts();
    };

    const updateTimerDisplay = () => {
        const elapsed = new Date().getTime() - currentSessionStartTime.getTime();
        elements.timerDisplay.textContent = formatDuration(elapsed);
        document.title = `${formatDuration(elapsed)} - متتبع العمل`;
    };

    // --- 6. الرسوم البيانية ---
    const renderCharts = () => {
        const isDarkMode = document.documentElement.getAttribute('data-bs-theme') === 'dark';
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const fontColor = isDarkMode ? '#dee2e6' : '#495057';
        
        Chart.defaults.color = fontColor;
        Chart.defaults.borderColor = gridColor;

        renderWeeklyBarChart();
        renderHourlyBreakdownChart();
    };

    function renderWeeklyBarChart() {
        if (weeklyChartInstance) weeklyChartInstance.destroy();
        const labels = [];
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateKey = d.toISOString().slice(0, 10);
            labels.push(d.toLocaleDateString('ar-EG', { weekday: 'short', day: 'numeric'}));
            const totalMs = (allData[dateKey] || []).reduce((sum, s) => sum + (s.end.getTime() - s.start.getTime()), 0);
            data.push((totalMs / (1000 * 60 * 60)).toFixed(2));
        }
        weeklyChartInstance = new Chart(elements.weeklyChartCanvas, {
            type: 'bar',
            data: { labels, datasets: [{ label: 'ساعات العمل', data, backgroundColor: 'rgba(0, 123, 255, 0.6)' }] },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, title: { display: true, text: 'ساعات' } } } }
        });
    }

    function renderHourlyBreakdownChart() {
        if (hourlyChartInstance) hourlyChartInstance.destroy();
        const hourlyTotals = Array(24).fill(0);
        Object.values(allData).flat().forEach(session => {
            let start = session.start, end = session.end;
            for (let hour = start.getHours(); hour <= end.getHours(); hour++) {
                const hStart = new Date(start).setHours(hour, 0, 0, 0);
                const hEnd = new Date(start).setHours(hour, 59, 59, 999);
                if (end > hStart && start < hEnd) {
                    hourlyTotals[hour] += (Math.min(end, hEnd) - Math.max(start, hStart)) / (1000 * 60);
                }
            }
        });
        hourlyChartInstance = new Chart(elements.hourlyChartCanvas, {
            type: 'bar',
            data: {
                labels: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}`),
                datasets: [{ label: 'إجمالي الدقائق', data: hourlyTotals, backgroundColor: 'rgba(23, 162, 184, 0.6)' }]
            },
            options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, scales: { x: { title: { display: true, text: 'دقائق' } } }, plugins: { legend: { display: false } } }
        });
    }

    // --- 7. معالجات الأحداث ---
    elements.datePicker.addEventListener('change', () => {
        currentDateKey = elements.datePicker.value;
        const isToday = currentDateKey === new Date().toISOString().slice(0, 10);
        elements.startStopBtn.disabled = !isToday || isTimerRunning;
        elements.manualForm.querySelector('button[type="submit"]').disabled = !isToday;
        renderUIForDate(currentDateKey);
    });
    
    elements.startStopBtn.addEventListener('click', () => {
        isTimerRunning = !isTimerRunning;
        elements.datePicker.disabled = isTimerRunning;
        if (isTimerRunning) {
            currentSessionStartTime = new Date();
            timerInterval = setInterval(updateTimerDisplay, 1000);
            updateTimerDisplay();
            elements.startStopBtn.innerHTML = `<i class="bi bi-stop-fill"></i> إيقاف`;
            elements.startStopBtn.classList.replace('btn-success', 'btn-danger');
        } else {
            clearInterval(timerInterval);
            document.title = "سجل ساعات العمل";
            const session = { start: currentSessionStartTime, end: new Date() };
            if ((session.end.getTime() - session.start.getTime()) >= 10000) {
                if (!allData[currentDateKey]) allData[currentDateKey] = [];
                allData[currentDateKey].push(session);
                saveData();
                renderUIForDate(currentDateKey);
            } else { alert("لم يتم حفظ الجلسة لأنها قصيرة جداً."); }
            elements.timerDisplay.textContent = "00:00:00";
            elements.startStopBtn.innerHTML = `<i class="bi bi-play-fill"></i> بدء`;
            elements.startStopBtn.classList.replace('btn-danger', 'btn-success');
        }
    });

    elements.manualForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const { value: startTime } = elements.startTimeInput, { value: endTime } = elements.endTimeInput;
        if (!startTime || !endTime || startTime >= endTime) return alert('أوقات غير صحيحة.');
        const newStart = new Date(`${currentDateKey}T${startTime}`), newEnd = new Date(`${currentDateKey}T${endTime}`);
        if ((allData[currentDateKey] || []).some(s => newStart < s.end && newEnd > s.start)) return alert('الوقت يتداخل مع جلسة أخرى.');
        if (!allData[currentDateKey]) allData[currentDateKey] = [];
        allData[currentDateKey].push({ start: newStart, end: newEnd });
        saveData();
        renderUIForDate(currentDateKey);
        elements.manualForm.reset();
        elements.manualCollapse.hide();
    });

    elements.sessionsTableBody.addEventListener('click', (e) => {
        const btn = e.target.closest('.delete-btn');
        if (btn) {
            const index = parseInt(btn.dataset.index, 10);
            if (confirm(`هل أنت متأكد من حذف الجلسة؟`)) {
                allData[currentDateKey].splice(index, 1);
                if (allData[currentDateKey].length === 0) delete allData[currentDateKey];
                saveData();
                renderUIForDate(currentDateKey);
            }
        }
    });

    elements.clearDataBtn.addEventListener('click', () => {
        if (isTimerRunning) return alert("يرجى إيقاف العداد أولاً.");
        if (!(allData[currentDateKey] || []).length) return alert("لا توجد بيانات لمسحها.");
        if (confirm(`هل أنت متأكد أنك تريد مسح كل بيانات يوم ${currentDateKey}؟`)) {
            delete allData[currentDateKey];
            saveData();
            renderUIForDate(currentDateKey);
        }
    });

    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-bs-theme', theme);
    };

    elements.darkModeSwitch.addEventListener('change', (e) => {
        const newTheme = e.target.checked ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
        renderCharts();
    });

    // --- 8. التشغيل الأولي ---
    const initialize = () => {
        loadData();
        const savedTheme = localStorage.getItem('theme') || 'light';
        elements.darkModeSwitch.checked = savedTheme === 'dark';
        applyTheme(savedTheme);
        elements.datePicker.value = currentDateKey;
        elements.datePicker.dispatchEvent(new Event('change'));
    };

    initialize();
});
