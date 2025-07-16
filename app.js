// ننتظر حتى يتم تحميل كل عناصر الصفحة بالكامل
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. تحديد العناصر الأساسية ---
    const timerDisplay = document.getElementById('timer-display');
    const startStopBtn = document.getElementById('start-stop-btn');
    const manualForm = document.getElementById('manual-form');
    const startTimeInput = document.getElementById('start-time');
    const endTimeInput = document.getElementById('end-time');
    const sessionsTableBody = document.getElementById('sessions-table-body');
    const totalHoursDisplay = document.getElementById('total-hours');
    const clearDataBtn = document.getElementById('clear-data-btn');

    // --- 2. متغيرات حالة التطبيق ---
    let timerInterval = null; // لتخزين المؤقت
    let isTimerRunning = false; // لمعرفة حالة العداد
    let currentSessionStartTime = null; // لتخزين وقت بدء الجلسة الحالية
    let sessions = []; // مصفوفة لتخزين كل جلسات العمل

    // --- 3. الدوال الأساسية ---

    // دالة لحفظ البيانات في المتصفح (localStorage)
    const saveData = () => {
        localStorage.setItem('workSessions', JSON.stringify(sessions));
    };

    // دالة لتحميل البيانات من المتصفح عند فتح الصفحة
    const loadData = () => {
        const savedSessions = localStorage.getItem('workSessions');
        if (savedSessions) {
            // نحول النصوص المخزنة إلى كائنات Date حقيقية
            sessions = JSON.parse(savedSessions).map(session => ({
                start: new Date(session.start),
                end: new Date(session.end)
            }));
        }
        renderUI();
    };

    // دالة لتنسيق الوقت (مثال: 14:05)
    const formatTime = (date) => {
        if (!date || isNaN(date)) return '---';
        return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    };

    // دالة لتنسيق المدة الزمنية (مثال: 01:30:15)
    const formatDuration = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return [hours, minutes, seconds]
            .map(v => v.toString().padStart(2, '0'))
            .join(':');
    };

    // دالة لتحديث واجهة المستخدم (عرض الجلسات والإجمالي)
    const renderUI = () => {
        // مسح الجدول الحالي
        sessionsTableBody.innerHTML = '';
        let totalMilliseconds = 0;

        // إضافة كل جلسة إلى الجدول
        sessions.forEach((session, index) => {
            const durationMs = session.end.getTime() - session.start.getTime();
            totalMilliseconds += durationMs;

            const row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td>${formatTime(session.start)}</td>
                <td>${formatTime(session.end)}</td>
                <td>${formatDuration(durationMs)}</td>
            `;
            sessionsTableBody.appendChild(row);
        });

        // تحديث إجمالي ساعات العمل
        totalHoursDisplay.textContent = formatDuration(totalMilliseconds);
    };

    // دالة لتحديث شاشة العداد كل ثانية
    const updateTimerDisplay = () => {
        const now = new Date();
        const elapsed = now.getTime() - currentSessionStartTime.getTime();
        timerDisplay.textContent = formatDuration(elapsed);
    };

    // --- 4. معالجات الأحداث (Event Handlers) ---

    // عند الضغط على زر "بدء/إيقاف"
    startStopBtn.addEventListener('click', () => {
        isTimerRunning = !isTimerRunning;

        if (isTimerRunning) {
            // حالة البدء
            currentSessionStartTime = new Date();
            timerInterval = setInterval(updateTimerDisplay, 1000);
            startStopBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stop-fill" viewBox="0 0 16 16"><path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z"/></svg>
                إيقاف
            `;
            startStopBtn.classList.remove('btn-success');
            startStopBtn.classList.add('btn-danger', 'running');
        } else {
            // حالة الإيقاف
            clearInterval(timerInterval);
            timerDisplay.textContent = "00:00:00";
            
            const session = {
                start: currentSessionStartTime,
                end: new Date()
            };
            sessions.push(session);
            
            saveData();
            renderUI();
            
            startStopBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>
                بدء
            `;
            startStopBtn.classList.remove('btn-danger', 'running');
            startStopBtn.classList.add('btn-success');
        }
    });

    // عند إضافة جلسة يدوياً
    manualForm.addEventListener('submit', (e) => {
        e.preventDefault(); // منع إعادة تحميل الصفحة

        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;

        if (!startTime || !endTime || startTime >= endTime) {
            alert('من فضلك أدخل وقت بدء وانتهاء صحيحين، وتأكد أن وقت الانتهاء بعد وقت البدء.');
            return;
        }

        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        const session = {
            start: new Date(`${today}T${startTime}`),
            end: new Date(`${today}T${endTime}`)
        };
        sessions.push(session);
        sessions.sort((a, b) => a.start - b.start); // نرتب الجلسات حسب وقت البدء
        
        saveData();
        renderUI();
        
        // مسح حقول الإدخال
        manualForm.reset();
    });

    // عند الضغط على زر مسح البيانات
    clearDataBtn.addEventListener('click', () => {
        if (confirm('هل أنت متأكد أنك تريد مسح كل بيانات اليوم؟ لا يمكن التراجع عن هذا الإجراء.')) {
            sessions = [];
            localStorage.removeItem('workSessions');
            renderUI();
        }
    });

    // --- 5. تشغيل التطبيق ---
    loadData();
});