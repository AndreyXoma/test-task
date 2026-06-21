/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenId, SystemItem, GoalItem, TimeBlock } from '../types';
import { 
  ChevronLeft, Sparkles, Settings, Play, CheckCircle2, AlertCircle, 
  Flame, Plus, Bookmark, Dumbbell, Globe, DollarSign, Brain, Heart,
  BarChart3, Smile, ArrowRight, RefreshCw, Milestone, MapPin, Coffee, HelpCircle, User, Pencil,
  Camera, Download, Upload, Bell, FileText, Lock, ChevronDown, ChevronUp, Trash2
} from 'lucide-react';

interface IPhoneSimulatorProps {
  currentScreen: ScreenId;
  onScreenChange: (screen: ScreenId) => void;
}

export default function IPhoneSimulator({ currentScreen, onScreenChange }: IPhoneSimulatorProps) {
  // Application Interactive States
  const [onboardingIndex, setOnboardingIndex] = useState(0);
  const [workoutStatus, setWorkoutStatus] = useState<'pending' | 'completed'>('pending');
  
  const getFormattedDateWithDay = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    const days = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
    return `${day}.${month}.${year} (${days[now.getDay()]})`;
  };

  const [activeSegment, setActiveSegment] = useState<'main' | 'weekend' | 'vacation'>(() => {
    const day = new Date().getDay();
    return (day === 0 || day === 6) ? 'weekend' : 'main';
  });
  
  // Systems State
  const [systems, setSystems] = useState<SystemItem[]>([
    { 
      id: 'sys1', 
      title: 'Физические тренировки', 
      linkedGoal: 'Атлетичное тело', 
      streakDays: 12, 
      adherencePercentage: 85, 
      color: '#24389c',
      milestones: [
        { id: 'm1', title: 'Силовая тренировка 3 раза в неделю', done: true },
        { id: 'm2', title: 'Держать дневную норму белка и пить воду', done: true },
        { id: 'm3', title: 'Контрастный утренний душ', done: false },
        { id: 'm4', title: 'Отказ от быстрых углеводов и сахара', done: false }
      ]
    },
    { 
      id: 'sys2', 
      title: 'Разговорная практика', 
      linkedGoal: 'Свободный английский', 
      streakDays: 4, 
      adherencePercentage: 62, 
      color: '#006e1c',
      milestones: [
        { id: 'm5', title: 'Разговаривать по-английски по 15 мин в день', done: true },
        { id: 'm6', title: 'Проходить 5 новых уроков/фраз', done: false },
        { id: 'm7', title: 'Чтение оригинальной статьи по работе/IT', done: false }
      ]
    },
  ]);

  // Selected system for details view
  const [selectedSystemId, setSelectedSystemId] = useState<string>('sys1');

  // Selected goal for details view
  const [selectedGoalId, setSelectedGoalId] = useState<string>('g1');

  // New success-task form state inside system details screen
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');

  // New task form state inside goal details screen
  const [newGoalTaskTitle, setNewGoalTaskTitle] = useState('');

  // Active tab inside the Today screen
  const [todayActiveTab, setTodayActiveTab] = useState<'systems' | 'ideal_day'>('systems');

  // Track completed timeblocks inside the Ideal Day selector
  const [completedTimeBlocks, setCompletedTimeBlocks] = useState<Record<string, boolean>>({
    'b1': true,
    'b2': true,
    'b3': false,
    'b4': false,
    'b5': false,
    'b6': false,
    'w1': true,
    'w2': false,
    'w3': false,
    'w4': false,
    'v1': true,
    'v2': false,
    'v3': false
  });

  // Ideal Day time blocks stateful default values mapping
  const [timeBlocks, setTimeBlocks] = useState<Record<string, TimeBlock[]>>({
    main: [
      { id: 'b1', time: '07:00', title: 'Утренний блок', description: 'Медитация, гидратация, свет.', color: '#24389c' },
      { id: 'b2', time: '08:00', title: 'Спорт', description: 'Зона 2 Кардио или Силовая.', color: '#006e1c' },
      { id: 'b3', time: '09:00', title: 'Глубокая работа', description: 'Фокус на ключевых задачах.', color: '#854d00' },
      { id: 'b4', time: '12:30', time_exact: '12:30', time_type: 'exact', title: 'Перезагрузка', description: 'Питательный обед и прогулка.', color: '#757684' },
      { id: 'b5', time: '14:00', title: 'Коллаборация', description: 'Встречи, синхронизация.', color: '#3f51b5' },
      { id: 'b6', time: '18:00', title: 'Завершение дня', description: 'Чтение, семья, без синего света.', color: '#693c00' },
    ],
    weekend: [
      { id: 'w1', time: '08:30', title: 'Медленное утро', description: 'Свободный чай, растяжка, чтение.', color: '#006e1c' },
      { id: 'w2', time: '10:00', title: 'Семья & Природа', description: 'Прогулка в парке или поездка.', color: '#24389c' },
      { id: 'w3', time: '15:00', title: 'Творческое хобби', description: 'Гитара, рисование, макетирование.', color: '#854d00' },
      { id: 'w4', time: '19:00', title: 'Сауна / Восстановление', description: 'Контрастный душ, рефлексия.', color: '#3f51b5' },
    ],
    vacation: [
      { id: 'v1', time: '09:00', title: 'Исследование', description: 'Новые места, музеи, прогулки без спешки.', color: '#854d00' },
      { id: 'v2', time: '13:00', title: 'Локальная кухня', description: 'Обед, новые гастрономические открытия.', color: '#006e1c' },
      { id: 'v3', time: '17:00', title: 'Дзен блок', description: 'Закат над горизонтом, море, тишина.', color: '#24389c' },
    ],
  });

  // Goals State
  const [goals, setGoals] = useState<GoalItem[]>([
    { 
      id: 'g1', 
      title: 'Атлетичное тело', 
      subtitle: 'Цель: 12% жира и сила кора', 
      progress: 75, 
      icon: 'dumbbell', 
      color: 'primary',
      tasks: [
        { id: 't1_1', title: 'Пройти функциональную диагностику опорно-двигательного аппарата', done: true },
        { id: 't1_2', title: 'Снизить процент жира до 12%', done: false },
        { id: 't1_3', title: 'Увеличить выносливость кора через планку до 5 минут', done: false },
        { id: 't1_4', title: 'Минимизировать уровень сахара и соли в рационе', done: true }
      ]
    },
    { 
      id: 'g2', 
      title: 'Финансовая свобода', 
      subtitle: 'Достичь целей по инвестициям', 
      progress: 85, 
      icon: 'dollar', 
      color: 'secondary',
      tasks: [
        { id: 't2_1', title: 'Сформировать подушку безопасности на 6 месяцев жизни', done: true },
        { id: 't2_2', title: 'Диверсифицировать инвестиции в портфель активов', done: true },
        { id: 't2_3', title: 'Увеличить активный доход от основной деятельности на 30%', done: false },
        { id: 't2_4', title: 'Закрыть все кредитные обязательства', done: true }
      ]
    },
    { 
      id: 'g3', 
      title: 'Свободный английский', 
      subtitle: 'Текущая серия разговорной практики', 
      progress: 40, 
      icon: 'globe', 
      color: 'tertiary',
      tasks: [
        { id: 't3_1', title: 'Освоить 1000 специализированных профессиональных слов', done: false },
        { id: 't3_2', title: 'Пройти 20 разговорных сессий с носителем языка', done: true },
        { id: 't3_3', title: 'Сдать пробный IELTS на балл не ниже 7.5', done: false }
      ]
    },
  ]);

  // Today path items status state for checking
  const [pathItems, setPathItems] = useState(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return [
      { id: 1, title: 'Подъем', time: '06:00', done: true, date: todayStr },
      { id: 2, title: 'Завтрак', time: '07:30', done: true, date: todayStr },
      { id: 3, title: 'Тренировка', time: '09:00', active: true, done: false, date: todayStr },
      { id: 4, title: 'Работа над проектом', time: '11:00', done: false, future: true, date: todayStr },
    ];
  });

  // Toast / Haptic alerts State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal / Sheet State
  const [activeModal, setActiveModal] = useState<'add_system' | 'add_goal' | 'add_timeblock' | 'edit_timeblock' | 'edit_metrics' | 'add_pathitem' | 'edit_pathitem' | null>(null);

  // Form Fields State
  const [newSysTitle, setNewSysTitle] = useState('');
  const [newSysGoal, setNewSysGoal] = useState('');
  const [newSysColor, setNewSysColor] = useState('#24389c');

  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalSubtitle, setNewGoalSubtitle] = useState('');
  const [newGoalProgress, setNewGoalProgress] = useState(10);
  const [newGoalColor, setNewGoalColor] = useState('primary');
  const [newGoalIcon, setNewGoalIcon] = useState('brain');

  const [newTbTime, setNewTbTime] = useState('10:00');
  const [newTbTitle, setNewTbTitle] = useState('');
  const [newTbDesc, setNewTbDesc] = useState('');
  const [newTbColor, setNewTbColor] = useState('#24389c');

  const [newPathTime, setNewPathTime] = useState('12:00 PM');
  const [newPathTitle, setNewPathTitle] = useState('');

  // Inline & modal system milestone editing states
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [editingMilestoneTitle, setEditingMilestoneTitle] = useState('');

  // Daily path date selection state
  const [selectedFilterDate, setSelectedFilterDate] = useState<string>(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
  });

  // Today path tasks: add details of day & time range / exact time
  const [newPathDate, setNewPathDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newPathTimeType, setNewPathTimeType] = useState<'range' | 'exact'>('range');
  const [newPathTimeStart, setNewPathTimeStart] = useState('10:00');
  const [newPathTimeEnd, setNewPathTimeEnd] = useState('11:30');
  const [newPathTimeExact, setNewPathTimeExact] = useState('12:00');

  // Ideal Day time blocks: add details of time range & editing states
  const [newTbTimeType, setNewTbTimeType] = useState<'range' | 'exact'>('range');
  const [newTbTimeStart, setNewTbTimeStart] = useState('08:00');
  const [newTbTimeEnd, setNewTbTimeEnd] = useState('09:30');
  const [newTbTimeExact, setNewTbTimeExact] = useState('10:00');

  const [editingTbId, setEditingTbId] = useState<string | null>(null);
  const [editingTbTitle, setEditingTbTitle] = useState('');
  const [editingTbDesc, setEditingTbDesc] = useState('');
  const [editingTbTimeType, setEditingTbTimeType] = useState<'range' | 'exact'>('range');
  const [editingTbTimeStart, setEditingTbTimeStart] = useState('08:00');
  const [editingTbTimeEnd, setEditingTbTimeEnd] = useState('09:30');
  const [editingTbTimeExact, setEditingTbTimeExact] = useState('10:00');
  const [editingTbColor, setEditingTbColor] = useState('#24389c');

  // Today path item editing state:
  const [editingPathItemId, setEditingPathItemId] = useState<number | null>(null);
  const [editingPathItemTitle, setEditingPathItemTitle] = useState('');
  const [editingPathItemDate, setEditingPathItemDate] = useState('');
  const [editingPathItemTimeType, setEditingPathItemTimeType] = useState<'range' | 'exact'>('range');
  const [editingPathItemTimeStart, setEditingPathItemTimeStart] = useState('10:00');
  const [editingPathItemTimeEnd, setEditingPathItemTimeEnd] = useState('11:30');
  const [editingPathItemTimeExact, setEditingPathItemTimeExact] = useState('12:00');

  // Goal Details state metrics
  const [metricWeight, setMetricWeight] = useState(78.4);
  const [metricWeightDiff, setMetricWeightDiff] = useState(-1.2);
  const [metricFat, setMetricFat] = useState(14.2);
  const [metricWaist, setMetricWaist] = useState(82);

  // Finance specific metrics
  const [metricFinanceSavings, setMetricFinanceSavings] = useState(35000);
  const [metricFinanceAssets, setMetricFinanceAssets] = useState(850);
  const [metricFinanceExpenses, setMetricFinanceExpenses] = useState(42);

  // Language specific metrics
  const [metricLangWords, setMetricLangWords] = useState(1820);
  const [metricLangHours, setMetricLangHours] = useState(4.8);
  const [metricLangLevel, setMetricLangLevel] = useState('B2 High');

  // Edit Modal States for currently selected Goal
  const [editGoalTitle, setEditGoalTitle] = useState('');
  const [editGoalSubtitle, setEditGoalSubtitle] = useState('');
  const [editGoalProgress, setEditGoalProgress] = useState(0);
  const [editGoalColor, setEditGoalColor] = useState('primary');

  // Edit states for metrics (backed up from global level to edit in modal safely)
  const [editWeight, setEditWeight] = useState(78.4);
  const [editWeightDiff, setEditWeightDiff] = useState(-1.2);
  const [editFat, setEditFat] = useState(14.2);
  const [editWaist, setEditWaist] = useState(82);

  // Edit states for finance
  const [editFinanceSavings, setEditFinanceSavings] = useState(35000);
  const [editFinanceAssets, setEditFinanceAssets] = useState(850);
  const [editFinanceExpenses, setEditFinanceExpenses] = useState(42);

  // Edit states for language
  const [editLangWords, setEditLangWords] = useState(1820);
  const [editLangHours, setEditLangHours] = useState(4.8);
  const [editLangLevel, setEditLangLevel] = useState('B2 High');

  // Inline task editing
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');

  // Real-time clock and automated analysis reminder state
  const [currentTime, setCurrentTime] = useState('09:41');
  const [analysisReminderTime, setAnalysisReminderTime] = useState(() => localStorage.getItem('al_reminder_time') || '21:00');
  const [isReminderSaved, setIsReminderSaved] = useState(true);
  const [showPushNotification, setShowPushNotification] = useState(false);
  const [pushNotificationText, setPushNotificationText] = useState('🌙 Время подвести итоги: проведите дисциплинарный анализ вашего дня!');
  const [hasShownTodayNotification, setHasShownTodayNotification] = useState(false);
  
  // Morning check-in / Morning reminders
  const [isMorningReminderActive, setIsMorningReminderActive] = useState(() => {
    const saved = localStorage.getItem('al_is_morning_reminder_active');
    return saved !== null ? saved === 'true' : true;
  });
  const [morningReminderTime, setMorningReminderTime] = useState(() => localStorage.getItem('al_morning_reminder_time') || '08:00');
  
  const [isEveningReminderActive, setIsEveningReminderActive] = useState(() => {
    const saved = localStorage.getItem('al_is_evening_reminder_active');
    return saved !== null ? saved === 'true' : true;
  });
  
  const [hasShownMorningNotification, setHasShownMorningNotification] = useState(false);
  const [hasShownEveningNotification, setHasShownEveningNotification] = useState(false);

  // User Profile / Cabinet states
  const [userPhoto, setUserPhoto] = useState(() => localStorage.getItem('al_user_photo') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200');
  const [userFio, setUserFio] = useState(() => localStorage.getItem('al_user_fio') || 'Алексей Смирнов');
  const [userAge, setUserAge] = useState(() => Number(localStorage.getItem('al_user_age')) || 28);
  const [userVision, setUserVision] = useState(() => localStorage.getItem('al_user_vision') || 'Финансовая независимость, международный уровень IT-продуктов, сильное и выносливое тело с гибким умом. Быть свободным в перемещениях, постоянно обучаться у лучших и улучшать качество жизни близких людей.');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Interactive calendar day selection in Weekly section
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<string>(() => new Date().toLocaleDateString('ru-RU'));

  // Active sub-segment in the Analysis (weekly_review) screen: 'daily' | 'weekly'
  const [analysisSubTab, setAnalysisSubTab] = useState<'daily' | 'weekly'>('daily');

  // Daily Analysis user inputs for reasons
  const [dailyUnmetReason, setDailyUnmetReason] = useState('');

  // Weekly Analysis user inputs
  const [weeklyReflection, setWeeklyReflection] = useState('');
  const [weeklyPlanForImprovement, setWeeklyPlanForImprovement] = useState('');

  // Logged reports for history lookup
  const [dailyAnalysisReports, setDailyAnalysisReports] = useState<any[]>([
    {
      date: '18.06.2026',
      completedSystems: 1,
      totalSystems: 2,
      uncompletedSystemTasks: ['Проходить 5 новых уроков/фраз'],
      uncompletedPathItems: ['Работа над проектом'],
      uncompletedIdealDayBlocks: ['Чтение книги'],
      systemReasons: 'Много времени ушло на домашние дела, устал под вечер',
      pathReasons: 'Форс-мажор на работе, задержался',
      idealDayReasons: 'Сонливость после ужина',
    },
    {
      date: '19.06.2026',
      completedSystems: 2,
      totalSystems: 2,
      uncompletedSystemTasks: [],
      uncompletedPathItems: [],
      uncompletedIdealDayBlocks: [],
      systemReasons: '',
      pathReasons: '',
      idealDayReasons: '',
    }
  ]);

  const [weeklyAnalysisReports, setWeeklyAnalysisReports] = useState<any[]>([
    {
      weekRange: '12 Июн — 18 Июн',
      overallProductivity: 78,
      reflection: 'Хороший фокус на тренировках, хромает англ из-за прокрастинации вечером.',
      improvementPlan: 'Перенести уроки на утро во время завтрака.',
    }
  ]);

  const [expandedWeeklyIndexes, setExpandedWeeklyIndexes] = useState<number[]>([0]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const timeStr = `${hh}:${mm}`;
      setCurrentTime(timeStr);

      // Check for Morning reminder match
      if (isMorningReminderActive && timeStr === morningReminderTime && !hasShownMorningNotification) {
        setPushNotificationText('☕ Утренний настрой: пора составить список дел и свериться с вашими 10-летними целями дисциплины!');
        setShowPushNotification(true);
        setHasShownMorningNotification(true);
      }

      // Check for Evening reminder match
      if (isEveningReminderActive && timeStr === analysisReminderTime && !hasShownEveningNotification) {
        setPushNotificationText('🌙 Вечернее подведение итогов: пора заполнить дисциплинарный отчет и проанализировать упущения!');
        setShowPushNotification(true);
        setHasShownEveningNotification(true);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, [
    isMorningReminderActive,
    morningReminderTime,
    hasShownMorningNotification,
    isEveningReminderActive,
    analysisReminderTime,
    hasShownEveningNotification
  ]);

  // --- PERSISTENT STORAGE SYNCHRONIZATION ---

  // 1. Initial Load on Mount
  useEffect(() => {
    try {
      const savedSystems = localStorage.getItem('al_systems');
      if (savedSystems) setSystems(JSON.parse(savedSystems));

      const savedGoals = localStorage.getItem('al_goals');
      if (savedGoals) setGoals(JSON.parse(savedGoals));

      const savedPathItems = localStorage.getItem('al_path_items');
      if (savedPathItems) setPathItems(JSON.parse(savedPathItems));

      const savedTimeBlocks = localStorage.getItem('al_completed_time_blocks');
      if (savedTimeBlocks) setCompletedTimeBlocks(JSON.parse(savedTimeBlocks));

      const savedDailyReports = localStorage.getItem('al_daily_reports');
      if (savedDailyReports) setDailyAnalysisReports(JSON.parse(savedDailyReports));

      const savedWeeklyReports = localStorage.getItem('al_weekly_reports');
      if (savedWeeklyReports) setWeeklyAnalysisReports(JSON.parse(savedWeeklyReports));

      const savedUserPhoto = localStorage.getItem('al_user_photo');
      if (savedUserPhoto) setUserPhoto(savedUserPhoto);

      const savedUserFio = localStorage.getItem('al_user_fio');
      if (savedUserFio) setUserFio(savedUserFio);

      const savedUserAge = localStorage.getItem('al_user_age');
      if (savedUserAge) setUserAge(Number(savedUserAge));

      const savedUserVision = localStorage.getItem('al_user_vision');
      if (savedUserVision) setUserVision(savedUserVision);

      const savedReminder = localStorage.getItem('al_reminder_time');
      if (savedReminder) setAnalysisReminderTime(savedReminder);

      const savedTimeBlocksCustom = localStorage.getItem('al_time_blocks_custom');
      if (savedTimeBlocksCustom) setTimeBlocks(JSON.parse(savedTimeBlocksCustom));
    } catch (e) {
      console.error("AL: Failed to load local storage data on mount", e);
    }
  }, []);

  // 2. Automated Save Listeners
  useEffect(() => {
    try {
      localStorage.setItem('al_time_blocks_custom', JSON.stringify(timeBlocks));
    } catch (e) { console.error(e); }
  }, [timeBlocks]);

  useEffect(() => {
    try {
      localStorage.setItem('al_systems', JSON.stringify(systems));
    } catch (e) { console.error(e); }
  }, [systems]);

  useEffect(() => {
    try {
      localStorage.setItem('al_goals', JSON.stringify(goals));
    } catch (e) { console.error(e); }
  }, [goals]);

  useEffect(() => {
    try {
      localStorage.setItem('al_path_items', JSON.stringify(pathItems));
    } catch (e) { console.error(e); }
  }, [pathItems]);

  useEffect(() => {
    try {
      localStorage.setItem('al_completed_time_blocks', JSON.stringify(completedTimeBlocks));
    } catch (e) { console.error(e); }
  }, [completedTimeBlocks]);

  useEffect(() => {
    try {
      localStorage.setItem('al_daily_reports', JSON.stringify(dailyAnalysisReports));
    } catch (e) { console.error(e); }
  }, [dailyAnalysisReports]);

  useEffect(() => {
    try {
      localStorage.setItem('al_weekly_reports', JSON.stringify(weeklyAnalysisReports));
    } catch (e) { console.error(e); }
  }, [weeklyAnalysisReports]);

  useEffect(() => {
    localStorage.setItem('al_user_photo', userPhoto);
  }, [userPhoto]);

  useEffect(() => {
    localStorage.setItem('al_user_fio', userFio);
  }, [userFio]);

  useEffect(() => {
    localStorage.setItem('al_user_age', String(userAge));
  }, [userAge]);

  useEffect(() => {
    localStorage.setItem('al_user_vision', userVision);
  }, [userVision]);

  useEffect(() => {
    localStorage.setItem('al_reminder_time', analysisReminderTime);
  }, [analysisReminderTime]);

  const handleOpenEditGoal = () => {
    const activeGoal = goals.find(g => g.id === selectedGoalId) || goals[0];
    if (activeGoal) {
      setSelectedGoalId(activeGoal.id);
      setEditGoalTitle(activeGoal.title);
      setEditGoalSubtitle(activeGoal.subtitle);
      setEditGoalProgress(activeGoal.progress);
      setEditGoalColor(activeGoal.color);
      
      setEditWeight(metricWeight);
      setEditWeightDiff(metricWeightDiff);
      setEditFat(metricFat);
      setEditWaist(metricWaist);
      
      setEditFinanceSavings(metricFinanceSavings);
      setEditFinanceAssets(metricFinanceAssets);
      setEditFinanceExpenses(metricFinanceExpenses);
      
      setEditLangWords(metricLangWords);
      setEditLangHours(metricLangHours);
      setEditLangLevel(metricLangLevel);
      
      setActiveModal('edit_metrics');
    }
  };

  // Dynamically calculate progress on the fly - redefined lower down to encompass all tasks, systems & ideal blocks
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const triggerNewDayReset = () => {
    // 1. Reset systems tasks
    setSystems(prev => prev.map(s => ({
      ...s,
      milestones: s.milestones?.map(m => ({ ...m, done: false })) || []
    })));

    // 2. Reset ideal day blocks
    setCompletedTimeBlocks({});

    // 3. Reset today path items
    setPathItems(prev => prev.map(p => ({
      ...p,
      done: false,
      active: p.id === 1 // Set early tasks active as default
    })));

    showToast('🌅 Новый день наступил! Задачи систем и идеального дня сброшены.');
  };

  useEffect(() => {
    const todayStr = new Date().toLocaleDateString('ru-RU');
    const savedDate = localStorage.getItem('last_accessed_date');
    if (savedDate && savedDate !== todayStr) {
      triggerNewDayReset();
    }
    localStorage.setItem('last_accessed_date', todayStr);
  }, []);

  // Onboarding Slides Data
  const onboardingSlides = [
    {
      tag: 'ФИЛОСОФИЯ',
      title: 'Создай жизнь своей мечты.',
      desc: 'Убежище для осознанной жизни и ритмичной эволюции.',
      img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800'
    },
    {
      tag: 'ЭВОЛЮЦИЯ',
      title: 'Системы, а не списки.',
      desc: 'Преодолейте тревогу продуктивности с гибкими, ориентированными на жизнь системами.',
      img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800'
    },
    {
      tag: 'ФОКУС',
      title: 'Ясность в тишине.',
      desc: 'Найдите свой пик продуктивности в минималистичном пространстве без отвлекающих факторов.',
      img: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=800'
    }
  ];

  // Auto scroll onboarding preview
  useEffect(() => {
    if (currentScreen === 'onboarding') {
      const interval = setInterval(() => {
        setOnboardingIndex((prev) => (prev + 1) % onboardingSlides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [currentScreen]);

  // Toggle path checklist item
  const togglePathItem = (id: number) => {
    setPathItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextDone = !item.done;
        if (id === 3) {
          setWorkoutStatus(nextDone ? 'completed' : 'pending');
        }
        return { ...item, done: nextDone };
      }
      return item;
    }));
    showToast('✅ Путь дня обновлен!');
  };

  // Triggering Workout Complete Action
  const handleWorkoutComplete = () => {
    if (workoutStatus === 'pending') {
      setWorkoutStatus('completed');
      setPathItems(prev => prev.map(item => item.id === 3 ? { ...item, done: true, active: false } : item));
      showToast('🎉 Тренировка отмечена выполненной! Прогресс обновлен!');
    } else {
      setWorkoutStatus('pending');
      setPathItems(prev => prev.map(item => item.id === 3 ? { ...item, done: false, active: true } : item));
      showToast('🔄 Тренировка сброшена в расписание.');
    }
  };

  // Systems habit log action
  const handleLogSystem = (systemId: string, name: string) => {
    setSystems(prev => prev.map(sys => {
      if (sys.id === systemId) {
        const nextAdherence = Math.min(sys.adherencePercentage + 4, 100);
        return {
          ...sys,
          streakDays: sys.streakDays + 1,
          adherencePercentage: nextAdherence
        };
      }
      return sys;
    }));
    showToast(`⚡ Лог записан для "${name}". Серия увеличена!`);
  };

  const globalToggleMilestone = (systemId: string, milestoneId: string) => {
    let msg = '🎯 Статус задачи успешно обновлен!';
    setSystems(prev => prev.map(s => {
      if (s.id === systemId) {
        const updatedMilestones = s.milestones?.map(m => 
          m.id === milestoneId ? { ...m, done: !m.done } : m
        ) || [];
        const doneCnt = updatedMilestones.filter(m => m.done).length;
        const nextAdherence = updatedMilestones.length > 0 
          ? Math.round((doneCnt / updatedMilestones.length) * 100) 
          : 100;

        const wasAllCompleted = s.milestones?.every(m => m.done) && (s.milestones?.length || 0) > 0;
        const isAllCompletedNow = updatedMilestones.every(m => m.done) && updatedMilestones.length > 0;

        let newStreak = s.streakDays;
        if (isAllCompletedNow && !wasAllCompleted) {
          newStreak += 1;
          msg = `🔥 Потрясающе! Все задачи системы "${s.title}" выполнены. Серия продлена!`;
        } else if (!isAllCompletedNow && wasAllCompleted) {
          newStreak = Math.max(0, newStreak - 1);
        }

        return {
          ...s,
          milestones: updatedMilestones,
          adherencePercentage: nextAdherence,
          streakDays: newStreak
        };
      }
      return s;
    }));
    showToast(msg);
  };

  // Implement system suggested by AI
  const handleImplementAIPickedSystem = () => {
    if (systems.some(s => s.id === 'sys3')) {
      showToast('🧘 Система медитаций уже внедрена!');
      return;
    }
    const newSys: SystemItem = {
      id: 'sys3',
      title: 'Система медитаций',
      linkedGoal: 'Медитация и фокус',
      streakDays: 1,
      adherencePercentage: 40,
      color: '#854d00',
      milestones: [
        { id: 'm3_1', title: 'Утренняя медитация 10 мин', done: true },
        { id: 'm3_2', title: 'Дыхание по кипу в моменты пиковой нагрузки', done: false },
        { id: 'm3_3', title: 'Дневник благодарности и отпускания обид перед сном', done: false }
      ]
    };
    const newGoal: GoalItem = {
      id: 'g4',
      title: 'Медитация и фокус',
      subtitle: 'Ментальное спокойствие',
      progress: 40,
      icon: 'brain',
      color: 'primary',
      tasks: [
        { id: 't4_1', title: 'Утренняя медитация 10 мин каждый день', done: true },
        { id: 't4_2', title: 'Дыхание по коду в моменты стресса', done: false },
        { id: 't4_3', title: 'Дневной чекап осознанности', done: false }
      ]
    };
    setSystems([...systems, newSys]);
    setGoals([...goals, newGoal]);
    showToast('🧘 Система медитаций и цель успешно внедрены!');
  };

  // Form Submissions
  const submitAddSystem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSysTitle.trim()) {
      showToast('⚠️ Введите название системы');
      return;
    }
    const targetTitle = newSysTitle.trim();
    // Generate specialized intelligent task blocks for specific system type to sound incredibly customized!
    const milestonesList = [
      { id: `m_${Date.now()}_1`, title: `Поставить регулярные триггеры для: ${targetTitle}`, done: false },
      { id: `m_${Date.now()}_2`, title: `Зафиксировать первые 10 успешных сессий подряд`, done: false },
      { id: `m_${Date.now()}_3`, title: `Оценить препятствия и скорректировать блоки времени`, done: false }
    ];

    const newSys: SystemItem = {
      id: `sys_${Date.now()}`,
      title: targetTitle,
      linkedGoal: newSysGoal || 'Общая эволюция',
      streakDays: 0,
      adherencePercentage: 0,
      color: newSysColor,
      milestones: milestonesList
    };
    setSystems([...systems, newSys]);
    setNewSysTitle('');
    setNewSysGoal('');
    setActiveModal(null);
    showToast(`🚀 Система "${targetTitle}" успешно интегрирована!`);
  };

  const submitAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) {
      showToast('⚠️ Введите цель');
      return;
    }
    const newGoalId = `goal_${Date.now()}`;
    const newGoal: GoalItem = {
      id: newGoalId,
      title: newGoalTitle,
      subtitle: newGoalSubtitle || 'В процессе достижения',
      progress: Number(newGoalProgress) || 0,
      icon: newGoalIcon,
      color: newGoalColor,
      tasks: [
        { id: `t_${Date.now()}_1`, title: 'Описать идеальное состояние и показатели через 3 месяца', done: false },
        { id: `t_${Date.now()}_2`, title: 'Сформировать систему ежедневных привычек', done: false },
        { id: `t_${Date.now()}_3`, title: 'Зафиксировать первую неделю стабильной практики', done: false }
      ]
    };
    setGoals([...goals, newGoal]);
    setSelectedGoalId(newGoalId);
    setNewGoalTitle('');
    setNewGoalSubtitle('');
    setNewGoalProgress(10);
    setActiveModal(null);
    showToast(`🎯 Цель "${newGoalTitle}" добавлена и выбрана!`);
  };

  const submitAddTimeblock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTbTitle.trim()) {
      showToast('⚠️ Введите название блока');
      return;
    }
    const finalTbTime = newTbTimeType === 'range' 
      ? `${newTbTimeStart} - ${newTbTimeEnd}` 
      : newTbTimeExact;

    const newTb: TimeBlock = {
      id: `tb_${Date.now()}`,
      time: finalTbTime,
      title: newTbTitle.trim(),
      description: newTbDesc.trim(),
      color: newTbColor
    };
    setTimeBlocks(prev => ({
      ...prev,
      [activeSegment]: [...prev[activeSegment], newTb].sort((a, b) => a.time.localeCompare(b.time))
    }));
    setNewTbTitle('');
    setNewTbDesc('');
    setActiveModal(null);
    showToast(`📅 Блок времени "${newTbTitle}" зафиксирован!`);
  };

  const submitEditTimeblock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTbId) return;
    if (!editingTbTitle.trim()) {
      showToast('⚠️ Введите название блока');
      return;
    }
    const finalTbTime = editingTbTimeType === 'range' 
      ? `${editingTbTimeStart} - ${editingTbTimeEnd}` 
      : editingTbTimeExact;

    setTimeBlocks(prev => {
      const segmentBlocks = prev[activeSegment] || [];
      const updatedBlocks = segmentBlocks.map(block => {
        if (block.id === editingTbId) {
          return {
            ...block,
            time: finalTbTime,
            title: editingTbTitle.trim(),
            description: editingTbDesc.trim(),
            color: editingTbColor
          };
        }
        return block;
      }).sort((a, b) => a.time.localeCompare(b.time));

      return {
        ...prev,
        [activeSegment]: updatedBlocks
      };
    });

    setActiveModal(null);
    setEditingTbId(null);
    showToast(`📝 Блок времени "${editingTbTitle}" успешно обновлен!`);
  };

  const submitAddPathitem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPathTitle.trim()) {
      showToast('⚠️ Введите название дела');
      return;
    }
    const finalTime = newPathTimeType === 'range' 
      ? `${newPathTimeStart} - ${newPathTimeEnd}` 
      : newPathTimeExact;

    const newItem = {
      id: Date.now(),
      title: newPathTitle.trim(),
      time: finalTime,
      done: false,
      date: newPathDate
    };
    setPathItems(prev => [...prev, newItem].sort((a, b) => a.time.localeCompare(b.time)));
    setNewPathTitle('');
    setActiveModal(null);
    showToast(`🔹 Дело "${newPathTitle}" успешно запланировано!`);
  };

  const submitEditMetrics = (e: React.FormEvent) => {
    e.preventDefault();
    setGoals(prev => prev.map(g => {
      if (g.id === selectedGoalId) {
        return {
          ...g,
          title: editGoalTitle.trim(),
          subtitle: editGoalSubtitle.trim(),
          progress: Number(editGoalProgress) || 0,
          color: editGoalColor
        };
      }
      return g;
    }));

    // Update the corresponding metrics based on what was modified
    setMetricWeight(editWeight);
    setMetricWeightDiff(editWeightDiff);
    setMetricFat(editFat);
    setMetricWaist(editWaist);

    setMetricFinanceSavings(editFinanceSavings);
    setMetricFinanceAssets(editFinanceAssets);
    setMetricFinanceExpenses(editFinanceExpenses);

    setMetricLangWords(editLangWords);
    setMetricLangHours(editLangHours);
    setMetricLangLevel(editLangLevel);

    setActiveModal(null);
    showToast('💾 Изменения по цели и метрикам сохранены!');
  };

  // Dynamically calculate Ideal Day active segment progress on the fly
  const activeSegmentBlocks = timeBlocks[activeSegment] || [];
  const completedSegmentsCount = activeSegmentBlocks.filter(tb => completedTimeBlocks[tb.id]).length;
  const idealDayProgress = activeSegmentBlocks.length > 0
    ? Math.round((completedSegmentsCount / activeSegmentBlocks.length) * 100)
    : 0;

  const userFirstName = userFio ? userFio.trim().split(/\s+/)[0] : "Пользователь";
  
  const getGreetingMessage = () => {
    const hour = parseInt(currentTime.split(':')[0], 10) || 9;
    if (hour >= 5 && hour < 12) return 'Доброе утро';
    if (hour >= 12 && hour < 18) return 'Добрый день';
    if (hour >= 18 && hour < 24) return 'Добрый вечер';
    return 'Доброй ночи';
  };

  const nextIdealDayBlock = activeSegmentBlocks.find(tb => !completedTimeBlocks[tb.id]) 
    || activeSegmentBlocks[activeSegmentBlocks.length - 1]; // fallback

  const handleNextActionToggle = () => {
    if (!nextIdealDayBlock) return;
    const blockId = nextIdealDayBlock.id;
    const currentlyDone = !!completedTimeBlocks[blockId];
    
    setCompletedTimeBlocks(prev => {
      const updated = {
        ...prev,
        [blockId]: !currentlyDone
      };
      localStorage.setItem('al_completed_time_blocks', JSON.stringify(updated));
      return updated;
    });

    if (!currentlyDone) {
      showToast(`⚡ Блок «${nextIdealDayBlock.title}» выполнен!`);
    } else {
      showToast(`↩️ Блок «${nextIdealDayBlock.title}» отмечен как невыполненный`);
    }
  };

  // Overall vision progress (tasks, ideal day, systems, and system milestones)
  const totalTasksCount = pathItems.length;
  const completedTasksCount = pathItems.filter(p => p.done).length;

  const totalIdealCount = activeSegmentBlocks.length;
  const completedIdealCount = activeSegmentBlocks.filter(tb => completedTimeBlocks[tb.id]).length;

  const totalSystemsCount = systems.length;
  const completedSystemsCount = systems.filter(s => s.milestones && s.milestones.length > 0 && s.milestones.every(m => m.done)).length;

  const totalSystemTasksCount = systems.flatMap(s => s.milestones || []).length;
  const completedSystemTasksCount = systems.flatMap(s => s.milestones || []).filter(m => m.done).length;

  const totalTodayItems = totalTasksCount + totalIdealCount + totalSystemsCount + totalSystemTasksCount;
  const completedTodayItems = completedTasksCount + completedIdealCount + completedSystemsCount + completedSystemTasksCount;

  const todayProgress = totalTodayItems > 0 
    ? Math.round((completedTodayItems / totalTodayItems) * 105) > 100 
      ? 100 
      : Math.round((completedTodayItems / totalTodayItems) * 100)
    : 0;

  return (
    <div className="w-screen h-screen bg-[#f8f9fa] overflow-hidden">

        {toastMessage && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs px-4 py-2.5 rounded-full shadow-xl backdrop-blur-md flex items-center gap-2 border border-white/10">
            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

      {/* Real High-Fidelity iPhone Device Frame Wrapper */}
      <div className="relative w-[385px] h-[820px] bg-slate-950 rounded-[55px] p-3.5 shadow-2xl border-4 border-slate-800 ring-12 ring-slate-900/40 overflow-hidden flex flex-col">


        {/* Device Screen Frame */}
        <div className="w-full h-full bg-[#f8f9fa] rounded-[42px] overflow-hidden relative flex flex-col select-none text-slate-900 font-sans shadow-inner">
          


          {/* iOS Push Notification Bubble Alert overlay */}
          {showPushNotification && (
            <div className="absolute top-11 left-4 right-4 z-50 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100/80 flex gap-2.5 items-start transition-all animate-bounce">
              <div className="w-8 h-8 rounded-full bg-[#24389c] text-white flex items-center justify-center shrink-0 font-black text-xs shadow-sm">
                AL
              </div>
              <div className="flex-grow text-left">
                <div className="flex justify-between items-center bg-transparent">
                  <span className="text-[10px] font-black text-[#24389c] uppercase tracking-wide">Ascendant Life</span>
                  <span className="text-[8.5px] text-slate-400 font-bold">сейчас</span>
                </div>
                <p className="text-[10px] font-bold text-slate-850 leading-snug mt-1">
                  {pushNotificationText}
                </p>
              </div>
              <button 
                onClick={() => setShowPushNotification(false)}
                className="text-slate-400 hover:text-slate-650 font-extrabold text-xs focus:outline-none p-0.5 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Interactive Screengroup Frame Switcher */}
          <div className="flex-1 overflow-y-auto no-scrollbar pb-24 relative">
            
            {/* 1. ONBOARDING SCREEN */}
            {currentScreen === 'onboarding' && (
              <div className="h-full min-h-[680px] relative flex flex-col justify-between">
                {/* Immersive background decoration */}
                <div className="absolute inset-0 z-0 bg-[#24389c]">
                  <img 
                    src={onboardingSlides[onboardingIndex].img} 
                    alt="Serenity" 
                    className="w-full h-full object-cover opacity-45 mix-blend-overlay transition-all duration-1000 scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#24389c]/40 via-transparent to-[#101c5c]/95"></div>
                </div>

                <div className="relative z-10 p-6 pt-16 flex flex-col items-center flex-grow justify-center text-center">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold tracking-widest uppercase mb-6">
                    {onboardingSlides[onboardingIndex].tag}
                  </span>
                  <h1 className="text-white text-3xl font-extrabold tracking-tight leading-tight mb-4 drop-shadow-sm min-h-[72px]">
                    {onboardingSlides[onboardingIndex].title}
                  </h1>
                  <p className="text-white/80 text-sm max-w-[280px] mx-auto leading-relaxed min-h-[60px]">
                    {onboardingSlides[onboardingIndex].desc}
                  </p>
                </div>

                {/* Bottom interactive card elements */}
                <div className="relative z-10 p-6 space-y-6 flex flex-col items-center">
                  {/* Indicators state */}
                  <div className="flex gap-1.5 justify-center">
                    {onboardingSlides.map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setOnboardingIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${onboardingIndex === i ? 'w-6 bg-white' : 'w-1.5 bg-white/30'}`}
                      />
                    ))}
                  </div>

                  <button 
                    onClick={() => {
                      showToast('🚀 Добро пожаловать во вселенную осознанности!');
                      onScreenChange('today');
                    }}
                    className="w-full h-14 bg-white text-[#24389c] font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer pointer-events-auto"
                  >
                    <span>Начать путь</span>
                    <ArrowRight size={16} />
                  </button>

                  <button 
                    onClick={() => onScreenChange('today')}
                    className="text-white/60 hover:text-white text-[11px] font-medium tracking-wide uppercase"
                  >
                    Уже есть аккаунт? Войти
                  </button>
                </div>
              </div>
            )}

            {/* 2. TODAY SCREEN */}
            {currentScreen === 'today' && (
              <div className="p-5 space-y-6">
                
                {/* Header profile navigation */}
                <div className="flex justify-between items-center bg-[#f8f9fa]/90 sticky top-0 z-10 py-1.5 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div 
                      onClick={() => onScreenChange('profile')}
                      className="w-9 h-9 rounded-full bg-slate-300 overflow-hidden border-2 border-[#24389c] cursor-pointer hover:opacity-95 active:scale-95 transition-all shrink-0"
                    >
                      <img 
                        src={userPhoto} 
                        alt={userFio} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
                        }}
                      />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] font-extrabold text-[#24389c] tracking-wider uppercase">
                        {getGreetingMessage()}, {userFirstName}
                      </span>
                      <h2 className="text-base font-extrabold text-slate-905 tracking-tight flex items-center gap-1.5 flex-wrap">
                        <span>Сегодня ({getFormattedDateWithDay()})</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-normal ${
                          activeSegment === 'weekend' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {activeSegment === 'weekend' ? 'Выходной 🌴' : 'Основной ⚡'}
                        </span>
                      </h2>
                    </div>
                  </div>
                  <button 
                    onClick={() => onScreenChange('profile')}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-2xs text-[#24389c] hover:bg-indigo-50 transition-colors"
                  >
                    <User size={18} />
                  </button>
                </div>

                {/* Dashboard summary progress cards */}
                <div 
                  onClick={() => onScreenChange('goals_list')}
                  className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 flex items-center justify-between relative overflow-hidden cursor-pointer hover:border-slate-200 transition-all active:scale-[0.98]"
                >
                  <div className="z-10 space-y-1 max-w-[170px] text-left">
                    <span className="text-[9px] font-extrabold text-indigo-700 tracking-wider uppercase">ОБЩИЙ ПРОГРЕСС ДНЯ</span>
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Прогресс</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">Ты развиваешься быстрее, чем ожидалось.</p>
                  </div>
                  <div className="relative flex items-center justify-center w-20 h-20 z-10">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#24389c" strokeWidth="4.5" strokeDasharray="213.6" strokeDashoffset={213.6 - (213.6 * todayProgress) / 100} strokeLinecap="round" className="transition-all duration-700" />
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#24389c" strokeWidth="4.5" className="opacity-15" />
                    </svg>
                    <span className="absolute text-base font-extrabold text-indigo-900">{todayProgress}%</span>
                  </div>
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-50/40 rounded-full blur-xl pointer-events-none"></div>
                </div>

                {/* Interactive Next Action Module Card */}
                {nextIdealDayBlock ? (
                  <div 
                    onClick={handleNextActionToggle}
                    className={`rounded-2xl p-4.5 flex items-center justify-between cursor-pointer transition-all active:scale-[0.98] ${
                      completedTimeBlocks[nextIdealDayBlock.id] 
                        ? 'bg-emerald-600 text-white shadow-emerald-100 shadow-md' 
                        : 'bg-[#24389c] text-white shadow-indigo-100 shadow-lg'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center shadow-inner shrink-0">
                        {completedTimeBlocks[nextIdealDayBlock.id] ? <CheckCircle2 size={18} className="text-white" /> : <Sparkles size={18} className="text-amber-305 text-amber-300 fill-amber-300" />}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[9px] font-extrabold text-white/75 tracking-wider uppercase">СЛЕДУЮЩЕЕ ДЕЙСТВИЕ ИЗ РИТМА</span>
                        <h4 className="text-xs font-black tracking-tight leading-normal max-w-[170px] truncate">{nextIdealDayBlock.title}</h4>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-extrabold bg-white/10 px-2.5 py-1 rounded-lg">
                        {nextIdealDayBlock.time} • {completedTimeBlocks[nextIdealDayBlock.id] ? 'Закрыто' : 'Закрыть'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-105 text-slate-500 rounded-2xl p-4.5 text-center text-xs font-bold">
                    Все ритмы идеального дня закрыты! 🎉
                  </div>
                )}

                {/* Systems Section with Tab Selector */}
                <div className="space-y-4">
                  <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setTodayActiveTab('systems');
                        showToast('📋 Активные Системы');
                      }}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                        todayActiveTab === 'systems'
                          ? 'bg-white text-[#24389c] shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Системы
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTodayActiveTab('ideal_day');
                        showToast('📅 Ритм Идеального Дня');
                      }}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                        todayActiveTab === 'ideal_day'
                          ? 'bg-white text-[#24389c] shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Идеальный День ({idealDayProgress}%)
                    </button>
                  </div>
                  
                  {todayActiveTab === 'systems' ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-extrabold text-slate-400 tracking-widest">АКТИВНЫЕ СИСТЕМЫ</span>
                        <button 
                          onClick={() => onScreenChange('systems_list')}
                          className="text-xs font-bold text-indigo-700 hover:underline"
                        >
                          Все системы
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {systems.map((sys) => {
                          const totalMilestones = sys.milestones?.length || 0;
                          const completedMilestones = sys.milestones?.filter(m => m.done).length || 0;
                          const isCompleted = totalMilestones > 0 && completedMilestones === totalMilestones;

                          return (
                            <div 
                              key={sys.id} 
                              className="bg-white rounded-2xl p-4 border border-slate-100 flex flex-col gap-3 shadow-2xs transition-all text-left"
                            >
                              <div className="flex justify-between items-start">
                                <div 
                                  onClick={() => {
                                    setSelectedSystemId(sys.id);
                                    onScreenChange('system_detail');
                                    showToast(`📊 Просмотр системы: ${sys.title}`);
                                  }}
                                  className="flex items-center gap-1.5 cursor-pointer hover:opacity-85"
                                >
                                  <Flame size={14} className="text-amber-500 fill-amber-400" />
                                  <span className="font-extrabold text-xs text-slate-800 hover:text-indigo-700 transition-colors">
                                    {sys.title}
                                  </span>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                  <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                                    isCompleted 
                                      ? 'bg-emerald-50 text-emerald-700' 
                                      : 'bg-amber-50 text-amber-600'
                                  }`}>
                                    {isCompleted ? 'Выполнена сегодня' : 'В процессе'}
                                  </span>
                                  <span className="text-[9px] font-bold text-slate-500">
                                    {sys.adherencePercentage}% соблюдение
                                  </span>
                                </div>
                              </div>

                              {/* Progress bar */}
                              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full transition-all duration-1000"
                                  style={{ 
                                    width: `${sys.adherencePercentage}%`,
                                    backgroundColor: sys.color || '#24389c'
                                  }}
                                ></div>
                              </div>

                              {/* Milestone summary status pill */}
                              <div className="flex justify-between items-center bg-slate-50/50 p-2 rounded-xl text-[11px] font-semibold text-slate-600 mt-0.5">
                                <span className="flex items-center gap-1">
                                  🎯 Задачи системы:
                                </span>
                                <span className="font-extrabold text-slate-850">
                                  {completedMilestones} из {totalMilestones} выполнено
                                </span>
                              </div>

                              <div className="flex justify-between items-center text-[9px] text-slate-400 pt-1.5 mt-0.5 border-t border-slate-50">
                                <span>Серия: <strong className="text-slate-700">{sys.streakDays} дн.</strong></span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedSystemId(sys.id);
                                    onScreenChange('system_detail');
                                  }}
                                  className="text-[#24389c] font-bold text-[9px] hover:underline cursor-pointer bg-transparent border-none p-0"
                                >
                                  Детали системы →
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* IDEAL DAY TAB SECTION */
                    <div className="space-y-4 text-left">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-extrabold text-slate-400 tracking-widest uppercase">
                          РЕЖИМ: {activeSegment === 'main' ? 'ОСНОВНОЙ' : activeSegment === 'weekend' ? 'ВЫХОДНОЙ' : 'ОТПУСК'}
                        </span>
                        <button 
                          onClick={() => onScreenChange('ideal_day')}
                          className="text-xs font-bold text-[#24389c] hover:underline"
                        >
                          Редактировать ритм
                        </button>
                      </div>

                      {/* Progress of Ideal Day */}
                      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm space-y-3 relative overflow-hidden">
                        <div className="flex justify-between items-start">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">КАЧЕСТВО ДНЯ</span>
                            <h4 className="text-base font-extrabold tracking-tight">Ритм выполнен на {idealDayProgress}%</h4>
                          </div>
                          <span className="text-xl font-bold text-emerald-400">{completedSegmentsCount}/{activeSegmentBlocks.length}</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-850 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                            style={{ width: `${idealDayProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* Checklist blocks list */}
                      {activeSegmentBlocks.length === 0 ? (
                        <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-400">
                           Нет добавленных блоков. Отредактируйте расписание.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {activeSegmentBlocks.map((block) => {
                            const isCompleted = completedTimeBlocks[block.id] || false;
                            const toggleBlockToday = (e: React.MouseEvent) => {
                              e.stopPropagation();
                              setCompletedTimeBlocks(prev => {
                                const nextVal = !isCompleted;
                                const updated = { ...prev, [block.id]: nextVal };
                                if (nextVal) {
                                  showToast(`🌟 Блок "${block.title}" завершен!`);
                                } else {
                                  showToast(`🔄 Блок "${block.title}" сброшен в план.`);
                                }
                                return updated;
                              });
                            };

                            return (
                              <div 
                                key={block.id}
                                onClick={toggleBlockToday}
                                className={`bg-white p-3 rounded-2xl border-l-4 shadow-3xs flex items-center justify-between cursor-pointer hover:shadow-xs transition-all active:scale-[0.99] select-none text-left ${
                                  isCompleted ? 'bg-emerald-50/15 border-l-emerald-500' : 'border-l-slate-300'
                                }`}
                                style={{ borderLeftColor: isCompleted ? '#10b981' : block.color }}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                                    isCompleted 
                                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-inner' 
                                      : 'border-slate-300'
                                  }`}>
                                    {isCompleted && <CheckCircle2 size={12} className="text-white" />}
                                  </div>
                                  <div>
                                    <div className="flex items-baseline gap-1.5">
                                      <span className="text-[10px] font-bold text-slate-400">{block.time}</span>
                                      <h4 className={`font-bold text-xs tracking-tight ${
                                        isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'
                                      }`}>{block.title}</h4>
                                    </div>
                                    <p className="text-[10px] text-slate-400">{block.description}</p>
                                  </div>
                                </div>

                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                  isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {isCompleted ? 'Выполнено' : 'План'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Today timeline list section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Путь сегодня</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={triggerNewDayReset}
                        className="text-[10px] font-bold text-slate-500 hover:text-indigo-700 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg flex items-center gap-1 transition-colors"
                        title="Симулировать новый день (сбросить все галочки)"
                      >
                        🌅 Сброс
                      </button>
                      <button 
                        onClick={() => onScreenChange('ideal_day')}
                        className="text-xs font-semibold text-indigo-700 hover:underline"
                      >
                        Идеальный день
                      </button>
                    </div>
                  </div>

                  {/* Mini Calendar strip */}
                  <div className="flex justify-between gap-1 p-2 bg-slate-50 rounded-2xl border border-slate-100 shadow-3xs overflow-x-auto select-none">
                    {[-3, -2, -1, 0, 1, 2, 3].map((offsetDays) => {
                      const d = new Date();
                      d.setDate(d.getDate() + offsetDays);
                      const dateStr = d.toISOString().split('T')[0];
                      const isSelected = selectedFilterDate === dateStr;
                      const isToday = d.toDateString() === new Date().toDateString();
                      const dayLabel = d.toLocaleDateString('ru-RU', { weekday: 'short' });
                      const dayNum = d.getDate();
                      
                      return (
                        <button
                          key={dateStr}
                          onClick={() => setSelectedFilterDate(dateStr)}
                          className={`flex flex-col items-center p-1.5 rounded-xl min-w-9 cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-[#24389c] text-white font-bold shadow-xs' 
                              : 'text-slate-600 hover:bg-slate-150'
                          }`}
                        >
                          <span className="text-[8px] uppercase font-bold opacity-80">{dayLabel}</span>
                          <span className="text-xs font-extrabold mt-0.5">{dayNum}</span>
                          {isToday && !isSelected && <div className="w-1 h-1 bg-[#24389c] rounded-full mt-0.5"></div>}
                        </button>
                      );
                    })}
                  </div>

                  {(() => {
                    const filteredPathItems = pathItems.filter(item => {
                      if (!item.date) return true; // fallback
                      return item.date === selectedFilterDate;
                    });

                    if (filteredPathItems.length === 0) {
                      return (
                        <div className="p-8 bg-slate-50 border border-dashed border-slate-200 rounded-3xl text-center text-xs text-slate-400 space-y-2">
                          <div className="text-xl">📅</div>
                          <p>На этот день нет запланированных дел.</p>
                          <button 
                            onClick={() => {
                              setNewPathDate(selectedFilterDate);
                              setActiveModal('add_pathitem');
                            }}
                            className="text-xs text-indigo-700 font-bold hover:underline bg-transparent border-0 cursor-pointer"
                          >
                            Запланировать первое дело
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div className="relative pl-6 space-y-6 py-2.5">
                        {/* Centered vertical link pipeline */}
                        <div className="absolute left-1.5 top-3 bottom-0.5 w-[1px] bg-indigo-150 border-dashed border-l border-slate-350"></div>

                        {filteredPathItems.map((item) => (
                          <div key={item.id} className="relative flex items-center justify-between group animate-fade-in text-left">
                            <div className="flex items-start gap-4 flex-grow relative">
                              <button 
                                onClick={() => togglePathItem(item.id)}
                                className={`absolute -left-[22px] top-1.5 w-3 h-3 rounded-full border-2 transition-all cursor-pointer ${
                                  item.done 
                                    ? 'bg-emerald-500 border-emerald-500 ring-4 ring-emerald-50' 
                                    : 'bg-white border-slate-300 hover:border-[#24389c]'
                                }`}
                              />
                              {editingPathItemId === item.id ? (
                                <div className="flex items-center gap-2 flex-grow pl-1" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="text"
                                    value={editingPathItemTitle}
                                    onChange={(e) => setEditingPathItemTitle(e.target.value)}
                                    className="text-xs p-1.5 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 flex-grow bg-white mr-1"
                                    placeholder="Название дела..."
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        if (editingPathItemTitle.trim()) {
                                          setPathItems(prev => prev.map(p => p.id === item.id ? { ...p, title: editingPathItemTitle.trim() } : p));
                                          showToast('📝 Дело обновлено!');
                                        }
                                        setEditingPathItemId(null);
                                      } else if (e.key === 'Escape') {
                                        setEditingPathItemId(null);
                                      }
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (editingPathItemTitle.trim()) {
                                        setPathItems(prev => prev.map(p => p.id === item.id ? { ...p, title: editingPathItemTitle.trim() } : p));
                                        showToast('📝 Дело обновлено!');
                                      }
                                      setEditingPathItemId(null);
                                    }}
                                    className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg shrink-0 cursor-pointer"
                                  >
                                    Сохр
                                  </button>
                                </div>
                              ) : (
                                <div 
                                  onClick={() => togglePathItem(item.id)}
                                  className="flex flex-col cursor-pointer text-left focus:opacity-75 select-none pr-4"
                                >
                                  <span className={`text-xs font-semibold text-slate-800 ${item.done ? 'line-through text-slate-400 opacity-60' : ''}`}>
                                    {item.title}
                                  </span>
                                  <span className={`text-[10px] ${item.done ? 'text-emerald-600' : 'text-slate-400'}`}>
                                    🕒 {item.time}
                                  </span>
                                </div>
                              )}
                            </div>

                            {editingPathItemId !== item.id && (
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={() => {
                                    setEditingPathItemId(item.id);
                                    setEditingPathItemTitle(item.title);
                                  }}
                                  className="text-slate-350 hover:text-indigo-600 transition-colors p-1 bg-transparent border-0 cursor-pointer"
                                  title="Редактировать"
                                >
                                  <Pencil size={11} />
                                </button>
                                <button
                                  onClick={() => {
                                    setPathItems(prev => prev.filter(p => p.id !== item.id));
                                    showToast('🗑️ Дело удалено');
                                  }}
                                  className="text-slate-350 hover:text-rose-500 transition-colors p-1 bg-transparent border-0 cursor-pointer"
                                  title="Удалить"
                                >
                                  ✕
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                  <button 
                    onClick={() => {
                      setNewPathDate(selectedFilterDate);
                      setActiveModal('add_pathitem');
                    }}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-[#24389c] font-bold text-[11px] rounded-xl flex items-center justify-center gap-1 border border-slate-200/50 cursor-pointer active:scale-[0.98] transition-all"
                  >
                    <Plus size={13} />
                    <span>Добавить дело</span>
                  </button>
                </div>

              </div>
            )}

            {/* 3. GOAL DETAIL SCREEN */}
            {currentScreen === 'goal_detail' && (() => {
              const activeGoal = goals.find(g => g.id === selectedGoalId) || goals[0];
              if (!activeGoal) return <div className="p-5 text-center text-slate-400">Цель не найдена</div>;

              const totalTasks = activeGoal.tasks?.length || 0;
              const completedTasks = activeGoal.tasks?.filter(t => t.done).length || 0;
              const calculatedProgress = totalTasks > 0 
                ? Math.round((completedTasks / totalTasks) * 100) 
                : activeGoal.progress;

              const toggleGoalTask = (taskId: string) => {
                setGoals(prev => prev.map(g => {
                  if (g.id === activeGoal.id) {
                    const nextTasks = g.tasks?.map(t => t.id === taskId ? { ...t, done: !t.done } : t) || [];
                    const doneCnt = nextTasks.filter(t => t.done).length;
                    const nextProgress = nextTasks.length > 0 ? Math.round((doneCnt / nextTasks.length) * 100) : g.progress;
                    return {
                      ...g,
                      tasks: nextTasks,
                      progress: nextProgress
                    };
                  }
                  return g;
                }));
                showToast('🎯 Статус задачи цели обновлен!');
              };

              const addGoalTask = (e: React.FormEvent) => {
                e.preventDefault();
                if (!newGoalTaskTitle.trim()) return;
                setGoals(prev => prev.map(g => {
                  if (g.id === activeGoal.id) {
                    const nextTasks = [
                      ...(g.tasks || []),
                      { id: `t_detail_${Date.now()}`, title: newGoalTaskTitle.trim(), done: false }
                    ];
                    const doneCnt = nextTasks.filter(t => t.done).length;
                    const nextProgress = Math.round((doneCnt / nextTasks.length) * 100);
                    return {
                      ...g,
                      tasks: nextTasks,
                      progress: nextProgress
                    };
                  }
                  return g;
                }));
                setNewGoalTaskTitle('');
                showToast('➕ Добавлена новая задача к цели!');
              };

              const deleteGoalTask = (taskId: string) => {
                setGoals(prev => prev.map(g => {
                  if (g.id === activeGoal.id) {
                    const nextTasks = g.tasks?.filter(t => t.id !== taskId) || [];
                    const doneCnt = nextTasks.filter(t => t.done).length;
                    const nextProgress = nextTasks.length > 0 ? Math.round((doneCnt / nextTasks.length) * 100) : 0;
                    return {
                      ...g,
                      tasks: nextTasks,
                      progress: nextProgress
                    };
                  }
                  return g;
                }));
                showToast('🗑️ Задача цели удалена');
              };

              // Dynamically find connected systems
              const connectedSystems = systems.filter(sys => 
                sys.linkedGoal.toLowerCase().trim() === activeGoal.title.toLowerCase().trim()
              );

              // Render metric sets based on the goal type/id
              const isFitness = activeGoal.id === 'g1' || activeGoal.title.toLowerCase().includes('атлет') || activeGoal.title.toLowerCase().includes('тело') || activeGoal.title.toLowerCase().includes('спорт');
              const isFinance = activeGoal.id === 'g2' || activeGoal.title.toLowerCase().includes('финанс') || activeGoal.title.toLowerCase().includes('деньг') || activeGoal.title.toLowerCase().includes('богат');
              const isEnglish = activeGoal.id === 'g3' || activeGoal.title.toLowerCase().includes('английск') || activeGoal.title.toLowerCase().includes('язык');

              return (
                <div className="p-5 space-y-6 text-left">
                  {/* Header Back Button banner */}
                  <div className="flex justify-between items-center py-2 bg-[#f8f9fa] sticky top-0 z-10 select-none">
                    <button 
                      onClick={() => onScreenChange('goals_list')}
                      className="flex items-center text-indigo-700 font-bold text-sm bg-transparent border-0 cursor-pointer"
                    >
                      <ChevronLeft size={20} className="-ml-1" />
                      <span>Все цели</span>
                    </button>
                    <h3 className="text-sm font-bold text-slate-800">Детали цели</h3>
                    <button 
                      onClick={handleOpenEditGoal}
                      className="text-indigo-700 font-semibold text-sm hover:opacity-85 cursor-pointer bg-transparent border-0"
                    >
                      Изм.
                    </button>
                  </div>

                  {/* Hero Section details chart */}
                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="72" cy="72" r="64" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                        <circle 
                          cx="72" 
                          cy="72" 
                          r="64" 
                          fill="none" 
                          stroke="#24389c" 
                          strokeWidth="6" 
                          strokeDasharray="402" 
                          strokeDashoffset={402 - (402 * calculatedProgress) / 100} 
                          strokeLinecap="round" 
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-3xl font-extrabold text-[#24389c]">{calculatedProgress}%</span>
                        <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest">ЗАВЕРШЕНО</span>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">{activeGoal.title}</h2>
                      <p className="text-slate-500 text-xs mt-1">{activeGoal.subtitle}</p>
                    </div>
                  </div>

                  {/* Tasks Section (Checklist) */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-extrabold text-slate-850 uppercase tracking-widest leading-none">Спринт-задачи цели</h3>
                      <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full select-none">
                        Выполнено {completedTasks} из {totalTasks}
                      </span>
                    </div>

                    {totalTasks === 0 ? (
                      <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-400">
                        Нет спринт-задач для этой цели. Добавьте первую задачу ниже.
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {activeGoal.tasks?.map((t) => (
                          <div 
                            key={t.id}
                            className="bg-white p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between shadow-3xs group transition-all"
                          >
                            {editingTaskId === t.id ? (
                              <div className="flex items-center gap-2 flex-grow">
                                <input
                                  type="text"
                                  value={editingTaskTitle}
                                  onChange={(e) => setEditingTaskTitle(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      if (editingTaskTitle.trim()) {
                                        setGoals(prev => prev.map(g => {
                                          if (g.id === activeGoal.id) {
                                            return {
                                              ...g,
                                              tasks: g.tasks?.map(tk => tk.id === t.id ? { ...tk, title: editingTaskTitle.trim() } : tk)
                                            };
                                          }
                                          return g;
                                        }));
                                      }
                                      setEditingTaskId(null);
                                      showToast('📝 Задача обновлена!');
                                    } else if (e.key === 'Escape') {
                                      setEditingTaskId(null);
                                    }
                                  }}
                                  className="text-xs p-1.5 px-3 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 flex-grow"
                                  autoFocus
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (editingTaskTitle.trim()) {
                                      setGoals(prev => prev.map(g => {
                                        if (g.id === activeGoal.id) {
                                          return {
                                            ...g,
                                            tasks: g.tasks?.map(tk => tk.id === t.id ? { ...tk, title: editingTaskTitle.trim() } : tk)
                                          };
                                        }
                                        return g;
                                      }));
                                    }
                                    setEditingTaskId(null);
                                    showToast('📝 Задача обновлена!');
                                  }}
                                  className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg cursor-pointer shrink-0"
                                >
                                  Сохр
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between flex-grow">
                                <div 
                                  onClick={() => toggleGoalTask(t.id)}
                                  className="flex items-start gap-3 cursor-pointer flex-1"
                                >
                                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 mt-0.5 ${
                                    t.done 
                                      ? 'bg-[#24389c] border-[#24389c] text-white shadow-xs' 
                                      : 'border-slate-300 hover:border-[#24389c]'
                                  }`}>
                                    {t.done && <CheckCircle2 size={12} className="text-white" />}
                                  </div>
                                  <span className={`text-xs font-semibold leading-normal pr-1 ${
                                    t.done ? 'line-through text-slate-400 opacity-70' : 'text-slate-800'
                                  }`}>
                                    {t.title}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-1 ml-2">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingTaskId(t.id);
                                      setEditingTaskTitle(t.title);
                                    }}
                                    className="text-slate-300 hover:text-indigo-600 opacity-60 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer p-1"
                                    title="Редактировать"
                                  >
                                    <Pencil size={12} />
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteGoalTask(t.id);
                                    }}
                                    className="text-slate-300 hover:text-rose-500 opacity-60 hover:opacity-100 transition-opacity shrink-0 bg-transparent border-none cursor-pointer p-1"
                                    title="Удалить"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Input form to add task inside goal details view */}
                    <form onSubmit={addGoalTask} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-extrabold text-slate-500">Добавить спринт-задачу</span>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={newGoalTaskTitle}
                          onChange={(e) => setNewGoalTaskTitle(e.target.value)}
                          placeholder="Новая задача для достижения цели..."
                          className="flex-grow text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-[#24389c] text-slate-800"
                        />
                        <button 
                          type="submit"
                          className="bg-[#24389c] text-white font-bold text-xs p-2.5 px-4 rounded-xl shadow-sm hover:bg-opacity-95 cursor-pointer flex items-center justify-center shrink-0"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Connected Systems List */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-extrabold text-slate-850 uppercase tracking-widest leading-none">Связанные системы</h3>
                    {connectedSystems.length === 0 ? (
                      <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-2xl text-xs text-slate-500 italic">
                        При привычных действиях свяжите систему с этой целью ("{activeGoal.title}"), чтобы синхронизировать прогресс.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {connectedSystems.map(sys => (
                          <div 
                            key={sys.id}
                            onClick={() => {
                              setSelectedSystemId(sys.id);
                              onScreenChange('system_detail');
                            }}
                            className="bg-white p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between shadow-2xs hover:border-[#24389c] cursor-pointer transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: sys.color }}>
                                <Flame size={16} />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-800">{sys.title}</p>
                                <p className="text-[11px] text-slate-400">Серия: {sys.streakDays} дн • Соблюдение {sys.adherencePercentage}%</p>
                              </div>
                            </div>
                            <span className="text-[9px] font-bold text-[#24389c] bg-indigo-50 p-1.5 px-2.5 rounded-full select-none shrink-0">Активна</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              );
            })()}

            {/* 3.1 SYSTEM_DETAIL SCREEN */}
            {currentScreen === 'system_detail' && (() => {
              const activeSys = systems.find(s => s.id === selectedSystemId) || systems[0];
              if (!activeSys) return <div className="p-5 text-center text-slate-400">Система не найдена</div>;
              
              const totalMilestones = activeSys.milestones?.length || 0;
              const completedMilestones = activeSys.milestones?.filter(m => m.done).length || 0;
              const calculatedAdherence = totalMilestones > 0 
                ? Math.round((completedMilestones / totalMilestones) * 100) 
                : activeSys.adherencePercentage;

              const toggleMilestone = (milestoneId: string) => {
                let msg = '🎯 Статус задачи успешно обновлен!';
                setSystems(prev => prev.map(s => {
                  if (s.id === activeSys.id) {
                    const updatedMilestones = s.milestones?.map(m => 
                      m.id === milestoneId ? { ...m, done: !m.done } : m
                    ) || [];
                    const doneCnt = updatedMilestones.filter(m => m.done).length;
                    const nextAdherence = updatedMilestones.length > 0 
                      ? Math.round((doneCnt / updatedMilestones.length) * 100) 
                      : 100;

                    const wasAllCompleted = s.milestones?.every(m => m.done) && (s.milestones?.length || 0) > 0;
                    const isAllCompletedNow = updatedMilestones.every(m => m.done) && updatedMilestones.length > 0;

                    let newStreak = s.streakDays;
                    if (isAllCompletedNow && !wasAllCompleted) {
                      newStreak += 1;
                      msg = '🔥 Потрясающе! Все задачи выполнены. Серия продлена!';
                    } else if (!isAllCompletedNow && wasAllCompleted) {
                      newStreak = Math.max(0, newStreak - 1);
                    }

                    return {
                      ...s,
                      milestones: updatedMilestones,
                      adherencePercentage: nextAdherence,
                      streakDays: newStreak
                    };
                  }
                  return s;
                }));
                showToast(msg);
              };

              const addMilestoneInsideDetail = (e: React.FormEvent) => {
                e.preventDefault();
                if (!newMilestoneTitle.trim()) return;
                
                setSystems(prev => prev.map(s => {
                  if (s.id === activeSys.id) {
                    const currentM = s.milestones || [];
                    const updatedMilestones = [
                      ...currentM,
                      { id: `m_sec_${Date.now()}`, title: newMilestoneTitle.trim(), done: false }
                    ];
                    const doneCnt = updatedMilestones.filter(m => m.done).length;
                    const nextAdherence = Math.round((doneCnt / updatedMilestones.length) * 105);
                    return {
                      ...s,
                      milestones: updatedMilestones,
                      adherencePercentage: Math.min(nextAdherence, 100)
                    };
                  }
                  return s;
                }));
                setNewMilestoneTitle('');
                showToast('➕ В систему добавлена новая фокусировка!');
              };

              const deleteMilestone = (milestoneId: string) => {
                setSystems(prev => prev.map(s => {
                  if (s.id === activeSys.id) {
                    const updatedMilestones = s.milestones?.filter(m => m.id !== milestoneId) || [];
                    const doneCnt = updatedMilestones.filter(m => m.done).length;
                    const nextAdherence = updatedMilestones.length > 0 
                      ? Math.round((doneCnt / updatedMilestones.length) * 100) 
                      : 0;
                    return {
                      ...s,
                      milestones: updatedMilestones,
                      adherencePercentage: nextAdherence
                    };
                  }
                  return s;
                }));
                showToast('🗑️ Задача удалена');
              };

              const submitEditMilestone = (milestoneId: string) => {
                if (!editingMilestoneTitle.trim()) {
                  showToast('⚠️ Введите название задачи');
                  return;
                }
                setSystems(prev => prev.map(s => {
                  if (s.id === activeSys.id) {
                    return {
                      ...s,
                      milestones: s.milestones?.map(m => m.id === milestoneId ? { ...m, title: editingMilestoneTitle.trim() } : m) || []
                    };
                  }
                  return s;
                }));
                setEditingMilestoneId(null);
                setEditingMilestoneTitle('');
                showToast('📝 Задача обновлена!');
              };

              return (
                <div className="p-5 space-y-6 text-left">
                  {/* Header sticky bar */}
                  <div className="flex justify-between items-center py-2 bg-[#f8f9fa] sticky top-0 z-10">
                    <button 
                      onClick={() => onScreenChange('systems_list')}
                      className="flex items-center text-indigo-700 font-bold text-sm bg-transparent border-0 cursor-pointer"
                    >
                      <ChevronLeft size={20} className="-ml-1" />
                      <span>Системы</span>
                    </button>
                    <h3 className="text-sm font-bold text-slate-800">Детали системы</h3>
                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: activeSys.color }} />
                  </div>

                  {/* Icon + Title Block */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-100 flex flex-col gap-4 shadow-2xs relative overflow-hidden">
                    <div className="absolute right-3 top-3 opacity-10">
                      <Sparkles size={52} style={{ color: activeSys.color }} />
                    </div>
                    <div>
                      <span className="text-[9px] font-extrabold text-slate-400 tracking-wider uppercase block mb-1">СИСТЕМНЫЙ БЛОК</span>
                      <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">{activeSys.title}</h2>
                      <p className="text-xs text-[#24389c] font-semibold mt-1">🎯 Цель: <strong className="text-slate-700">{activeSys.linkedGoal}</strong></p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100/50">
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Серия</span>
                        <span className="text-lg font-extrabold text-[#24389c] mt-0.5 block">{activeSys.streakDays} дней</span>
                      </div>
                      <div className="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100/50">
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Соблюдение</span>
                        <span className="text-lg font-extrabold text-emerald-600 mt-0.5 block">{calculatedAdherence}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Goals & Tasks heading */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-extrabold text-slate-850 uppercase tracking-widest leading-none">Задачи и Фокусы Системы</h3>
                      <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full">
                        Выполнено {completedMilestones} из {totalMilestones}
                      </span>
                    </div>

                    {/* Milestones Checklist */}
                    {totalMilestones === 0 ? (
                      <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-400">
                        Нет активных задач в системе. Добавьте их ниже.
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {activeSys.milestones?.map((m) => (
                          <div 
                            key={m.id}
                            className="bg-white p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between shadow-3xs group transition-all"
                          >
                            {editingMilestoneId === m.id ? (
                              <div className="flex-grow flex gap-2 items-center">
                                <input
                                  type="text"
                                  value={editingMilestoneTitle}
                                  onChange={(e) => setEditingMilestoneTitle(e.target.value)}
                                  className="flex-grow text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-[#24389c] text-slate-800"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      submitEditMilestone(m.id);
                                    } else if (e.key === 'Escape') {
                                      setEditingMilestoneId(null);
                                    }
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => submitEditMilestone(m.id)}
                                  className="text-emerald-600 hover:text-emerald-700 p-1.5 font-bold text-xs bg-slate-100 rounded-lg shrink-0 cursor-pointer"
                                >
                                  Сохранить
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingMilestoneId(null)}
                                  className="text-slate-400 hover:text-slate-600 p-1.5 font-bold text-xs bg-slate-100 rounded-lg shrink-0 cursor-pointer"
                                >
                                  Отмена
                                </button>
                              </div>
                            ) : (
                              <>
                                <div 
                                  onClick={() => toggleMilestone(m.id)}
                                  className="flex items-start gap-3 cursor-pointer flex-1"
                                >
                                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 mt-0.5 ${
                                    m.done 
                                      ? 'bg-[#24389c] border-[#24389c] text-white shadow-xs' 
                                      : 'border-slate-300 hover:border-[#24389c]'
                                  }`}>
                                    {m.done && <CheckCircle2 size={12} className="text-white" />}
                                  </div>
                                  <span className={`text-xs font-semibold leading-normal ${
                                    m.done ? 'line-through text-slate-400 opacity-70' : 'text-slate-800'
                                  }`}>
                                    {m.title}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-1 shrink-0 ml-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingMilestoneId(m.id);
                                      setEditingMilestoneTitle(m.title);
                                    }}
                                    className="text-slate-300 hover:text-indigo-600 transition-colors bg-transparent border-0 cursor-pointer p-1"
                                    title="Редактировать"
                                  >
                                    <Pencil size={11} />
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={() => deleteMilestone(m.id)}
                                    className="text-slate-300 hover:text-rose-500 opacity-60 hover:opacity-100 transition-opacity ml-2 shrink-0 bg-transparent border-none pointer-events-auto cursor-pointer p-1"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Input form to add milestones inside system details */}
                  <form onSubmit={addMilestoneInsideDetail} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-left">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-extrabold text-slate-500">Запланировать шаг к успеху</span>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={newMilestoneTitle}
                        onChange={(e) => setNewMilestoneTitle(e.target.value)}
                        placeholder="Добавить новую задачу..."
                        className="flex-grow text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-[#24389c] text-slate-805"
                      />
                      <button 
                        type="submit"
                        className="bg-[#24389c] text-white font-bold text-xs p-2.5 px-4 rounded-xl shadow-sm hover:bg-opacity-95 cursor-pointer flex items-center"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </form>
                </div>
              );
            })()}

            {/* 4. SYSTEMS LIST SCREEN */}
            {currentScreen === 'systems_list' && (
              <div className="p-5 space-y-6">
                
                {/* Header Profile view navigation */}
                <div className="flex justify-between items-center bg-[#f8f9fa] sticky top-0 z-10 py-2">
                  <div 
                    onClick={() => onScreenChange('profile')}
                    className="w-8 h-8 rounded-full bg-indigo-505 overflow-hidden flex items-center justify-center border border-[#24389c] cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                  >
                    <img 
                      src={userPhoto} 
                      alt="User profile" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200';
                      }}
                    />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">Список систем</h3>
                  <button 
                    onClick={() => onScreenChange('weekly_review')}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                  >
                    <Settings size={16} />
                  </button>
                </div>

                {/* Hero Section */}
                <div className="space-y-1">
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">Устойчивый успех</h2>
                  <p className="text-slate-500 text-xs leading-relaxed">Какие системы делают твою эволюцию неизбежной?</p>
                </div>

                {/* Active Systems List with incremental Log Button interaction */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-extrabold text-indigo-700 tracking-widest uppercase">АКТИВНЫЕ СИСТЕМЫ</span>
                    <button 
                      onClick={() => setActiveModal('add_system')}
                      className="text-[10px] font-bold text-[#24389c] bg-indigo-50 hover:bg-indigo-100 p-1 px-2.5 rounded-full flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus size={11} />
                      <span>Создать</span>
                    </button>
                  </div>

                  {systems.map((sys) => (
                    <div key={sys.id} className="bg-white p-5 rounded-2xl border border-slate-100 space-y-4 shadow-sm hover:border-slate-200 transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-base text-slate-950">{sys.title}</h4>
                          <p className="text-slate-400 text-xs mt-1">🎯 Цель: {sys.linkedGoal}</p>
                        </div>
                        <div className="bg-emerald-50 text-emerald-700 font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Flame size={12} className="fill-emerald-500" />
                          <span>{sys.streakDays} дней</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Еженедельное соблюдение</span>
                          <span className="text-indigo-600 font-extrabold">{sys.adherencePercentage}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500" 
                            style={{ 
                              width: `${sys.adherencePercentage}%`,
                              backgroundColor: sys.color || '#24389C'
                            }} 
                          />
                        </div>
                      </div>

                      <div className="flex gap-2.5 pt-1.5">
                        <button 
                          onClick={() => {
                            setSelectedSystemId(sys.id);
                            onScreenChange('system_detail');
                          }}
                          className="w-full py-2 bg-[#24389c]/10 text-[#24389c] hover:bg-[#24389c] hover:text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer text-center"
                        >
                          Редактировать и управлять задачами →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* 5. GOALS LIST SCREEN */}
            {currentScreen === 'goals_list' && (
              <div className="p-5 space-y-6">
                
                {/* Header */}
                <div className="flex justify-between items-center text-[#24389c] py-2 sticky top-0 bg-[#f8f9fa] z-10">
                  <div 
                    onClick={() => onScreenChange('profile')}
                    className="w-8 h-8 rounded-full overflow-hidden border border-[#24389c] cursor-pointer hover:opacity-90 active:scale-95 transition-all shrink-0"
                  >
                    <img 
                      src={userPhoto} 
                      alt="User avatar" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
                      }}
                    />
                  </div>
                  <h3 className="text-slate-800 font-bold text-sm">Ваши Цели</h3>
                  <button 
                    onClick={() => onScreenChange('profile')}
                    className="text-[#24389c] hover:bg-slate-100 p-1.5 rounded-full transition-all"
                  >
                    <User size={18} />
                  </button>
                </div>

                {/* Greeting / Intro */}
                <div className="space-y-1">
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">Какие цели приведут тебя туда?</h2>
                  <p className="text-xs text-slate-500">Фокусируйся на эволюции, а не только на результате.</p>
                </div>

                {/* Goals Grid view */}
                <div className="grid grid-cols-2 gap-4">
                  {goals.map((g) => (
                    <div 
                      key={g.id} 
                      onClick={() => {
                        setSelectedGoalId(g.id);
                        onScreenChange('goal_detail');
                        showToast(`📊 Просмотр подробных метрик: ${g.title}`);
                      }}
                      className="bg-white p-4.5 rounded-2xl border border-slate-100 flex flex-col justify-between min-h-[160px] cursor-pointer hover:border-slate-200 transition-all shadow-2xs active:scale-[0.98]"
                    >
                      <div className="flex justify-between items-start">
                        <div className={`p-2.5 rounded-full ${
                          g.color === 'primary' ? 'bg-indigo-50 text-indigo-700' :
                          g.color === 'secondary' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {g.icon === 'dumbbell' ? <Dumbbell size={16} /> :
                           g.icon === 'dollar' ? <DollarSign size={16} /> :
                           g.icon === 'brain' ? <Brain size={16} /> : <Globe size={16} />}
                        </div>
                        
                        {/* Dynamic SVG Circular Ring */}
                        <div className="relative w-10 h-10 flex items-center justify-center">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="14" fill="none" strokeWidth="3" className={`opacity-15 ${
                              g.color === 'primary' ? 'stroke-indigo-600' :
                              g.color === 'secondary' ? 'stroke-emerald-600' : 'stroke-amber-600'
                            }`} />
                            <circle 
                              cx="18" 
                              cy="18" 
                              r="14" 
                              fill="none" 
                              strokeWidth="3" 
                              strokeDasharray="88" 
                              strokeDashoffset={88 - (88 * g.progress) / 100} 
                              strokeLinecap="round" 
                              className={
                                g.color === 'primary' ? 'stroke-indigo-600' :
                                g.color === 'secondary' ? 'stroke-emerald-600' : 'stroke-amber-600'
                              }
                            />
                          </svg>
                          <span className="absolute text-[9px] font-bold text-slate-800">{g.progress}%</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-slate-900 leading-tight mb-1">{g.title}</h4>
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest leading-none block">
                          {g.subtitle.length > 20 ? g.subtitle.slice(0, 18) + '...' : g.subtitle}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Complete add card */}
                  <div 
                    onClick={() => setActiveModal('add_goal')}
                    className="border-2 border-dashed border-slate-200 p-4.5 rounded-2xl flex flex-col items-center justify-center min-h-[160px] cursor-pointer group hover:border-indigo-400 hover:bg-indigo-50/10 transition-all active:scale-[0.98]"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 mb-2 transition-all">
                      <Plus size={20} />
                    </div>
                    <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 transition-all">Добавить цель</span>
                  </div>
                </div>

                {/* Success image cover container */}
                <div className="bg-slate-100 rounded-3xl p-6 relative overflow-hidden flex items-end min-h-[180px] shadow-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800" 
                    alt="Cool sports car track day" 
                    className="absolute inset-0 w-full h-full object-cover brightness-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  <div className="relative z-10 space-y-1.5 text-white text-left">
                    <span className="text-[9px] font-extrabold text-indigo-300 uppercase tracking-widest leading-none">ПУТЬ К СЕБЕ</span>
                    <h4 className="text-lg font-bold leading-tight">Строим идеальную жизнь, от которой не нужен отпуск.</h4>
                  </div>
                </div>

              </div>
            )}

            {/* 6. IDEAL DAY SCREEN */}
            {currentScreen === 'ideal_day' && (
              <div className="p-5 space-y-6">
                
                {/* Header block navigation */}
                <div className="flex justify-between items-center text-slate-800 py-2 sticky top-0 bg-[#f8f9fa] z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                      ИД
                    </div>
                    <h3 className="text-slate-800 font-bold text-sm">Идеальный день</h3>
                  </div>
                  <button className="text-slate-500">
                    <Settings size={18} />
                  </button>
                </div>

                {/* Sub Segment template switcher */}
                <div className="bg-slate-100 p-1 rounded-xl flex gap-1 shadow-inner">
                  {(['main', 'weekend', 'vacation'] as const).map((seg) => (
                    <button 
                      key={seg}
                      onClick={() => {
                        setActiveSegment(seg);
                        showToast(`📅 Шаблон изменен на "${seg === 'main' ? 'Основной' : seg === 'weekend' ? 'Выходной' : 'Отпуск'}"`);
                      }}
                      className={`flex-1 py-1 px-1.5 text-xs font-bold rounded-lg transition-all ${
                        activeSegment === seg 
                          ? 'bg-white text-indigo-700 shadow-xs' 
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {seg === 'main' && 'Основной'}
                      {seg === 'weekend' && 'Выходной'}
                      {seg === 'vacation' && 'Отпуск'}
                    </button>
                  ))}
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">Ежедневный ритм</h2>
                  <p className="text-xs text-slate-500">Твоя база для осознанного прогресса.</p>
                </div>

                 {/* Time blocks rendering mapping status layout */}
                 <div className="space-y-4">
                   {timeBlocks[activeSegment].map((block) => (
                     <div key={block.id} className="flex gap-3 items-start animate-fade-in text-left">
                       <div className="w-16 pt-2 text-right">
                         <span className="text-[10px] font-bold text-slate-400 block break-words">{block.time}</span>
                       </div>
                       <div 
                         className="flex-grow bg-white p-3.5 rounded-2xl shadow-xs hover:shadow-sm border-l-4 transition-all flex justify-between items-center"
                         style={{ borderLeftColor: block.color }}
                       >
                         <div className="text-left space-y-0.5 pr-2">
                           <h4 className="font-bold text-xs tracking-tight text-slate-950">{block.title}</h4>
                           <p className="text-[10px] text-slate-400">{block.description}</p>
                         </div>
                         <div className="flex items-center gap-1.5 shrink-0">
                           <button
                             onClick={() => {
                               const isRange = block.time.includes(' - ');
                               setEditingTbId(block.id);
                               setEditingTbTitle(block.title);
                               setEditingTbDesc(block.description);
                               setEditingTbColor(block.color);
                               setEditingTbTimeType(isRange ? 'range' : 'exact');
                               if (isRange) {
                                 const [start, end] = block.time.split(' - ');
                                 setEditingTbTimeStart(start || '08:00');
                                 setEditingTbTimeEnd(end || '09:30');
                               } else {
                                 setEditingTbTimeExact(block.time || '10:00');
                               }
                               setActiveModal('edit_timeblock');
                             }}
                             className="text-slate-350 hover:text-indigo-600 transition-colors p-1 bg-transparent border-0 cursor-pointer"
                             title="Редактировать"
                           >
                             <Pencil size={11} />
                           </button>
                           <button
                             onClick={() => {
                               setTimeBlocks(prev => ({
                                 ...prev,
                                 [activeSegment]: prev[activeSegment].filter(b => b.id !== block.id)
                               }));
                               showToast(`🗑️ Блок "${block.title}" удален`);
                             }}
                             className="text-slate-350 hover:text-rose-500 transition-colors p-1 bg-transparent border-0 cursor-pointer"
                             title="Удалить"
                           >
                             ✕
                           </button>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>

                {/* Dynamic input template creator trigger */}
                <button 
                  onClick={() => setActiveModal('add_timeblock')}
                  className="w-full py-4 border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:text-indigo-600 transition-all font-bold text-xs cursor-pointer active:scale-[0.99]"
                >
                  <Plus size={16} />
                  <span>Добавить блок времени</span>
                </button>

              </div>
            )}

            {/* 7. WEEKLY REVIEW SCREEN */}
            {currentScreen === 'weekly_review' && (() => {
              // Collect counts
              const uncompletedSystemTasks = systems.flatMap(s => s.milestones || []).filter(m => !m.done);
              const completedSystemTasks = systems.flatMap(s => s.milestones || []).filter(m => m.done);
              const completedSystems = systems.filter(s => s.milestones && s.milestones.length > 0 && s.milestones.every(m => m.done));
              const uncompletedSystems = systems.filter(s => !s.milestones || s.milestones.length === 0 || !s.milestones.every(m => m.done));

              const uncompletedPath = pathItems.filter(p => !p.done);
              const completedPath = pathItems.filter(p => p.done);

              const uncompletedIdeal = activeSegmentBlocks.filter(tb => !completedTimeBlocks[tb.id]);
              const completedIdeal = activeSegmentBlocks.filter(tb => completedTimeBlocks[tb.id]);

              const totalRequired = systems.flatMap(s => s.milestones || []).length + pathItems.length + activeSegmentBlocks.length;
              const totalDone = completedSystemTasks.length + completedPath.length + completedIdeal.length;
              const weeklyProgress = totalRequired > 0 ? Math.round((totalDone / totalRequired) * 100) : 80;

              // Action for adding daily analysis
              const handleSaveDailyAnalysis = () => {
                const dateStr = new Date().toLocaleDateString('ru-RU');
                
                const newReport = {
                  date: dateStr,
                  completedSystems: completedSystems.length,
                  totalSystems: systems.length,
                  uncompletedSystemTasks: uncompletedSystemTasks.map(t => t.title),
                  uncompletedPathItems: uncompletedPath.map(p => p.title),
                  uncompletedIdealDayBlocks: uncompletedIdeal.map(tb => tb.title),
                  systemReasons: dailyUnmetReason.trim() || 'Без особых замечаний',
                  pathReasons: dailyUnmetReason.trim() || 'Без особых замечаний',
                  idealDayReasons: dailyUnmetReason.trim() || 'Без особых замечаний',
                  completedSystemIds: completedSystems.map(s => s.id),
                  completedSystemNames: completedSystems.map(s => s.title),
                };

                setDailyAnalysisReports(prev => [newReport, ...prev]);
                setDailyUnmetReason('');
                showToast('✅ Анализ вашего дня зафиксирован и сохранен!');
              };

              const handleSaveWeeklyAnalysis = () => {
                const newWeeklyReport = {
                  weekRange: '13 Июн — 20 Июн',
                  overallProductivity: weeklyProgress,
                  reflection: weeklyReflection.trim() || 'Проведена общая рефлексия дисциплины.',
                  improvementPlan: weeklyPlanForImprovement.trim() || 'План оптимизации составлен.',
                };

                setWeeklyAnalysisReports(prev => [newWeeklyReport, ...prev]);
                setExpandedWeeklyIndexes([0]);
                setWeeklyReflection('');
                setWeeklyPlanForImprovement('');
                showToast('🏆 Еженедельный отчет сохранен и добавлен в историю!');
                onScreenChange('today');
              };

              // --- DYNAMIC RETENTION AND WEEKLY CALENDAR HELPERS ---
              const getWeekDates = () => {
                const current = new Date();
                const week = [];
                // Find Monday of the current week (handling Sunday as day 7)
                const currentDay = current.getDay();
                const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
                const monday = new Date(current);
                monday.setDate(current.getDate() + distanceToMonday);
                
                for (let i = 0; i < 7; i++) {
                  const day = new Date(monday);
                  day.setDate(monday.getDate() + i);
                  week.push(day);
                }
                return week;
              };

              const getSystemRetentionThisWeek = (sys: SystemItem) => {
                const weekDates = getWeekDates().map(d => d.toLocaleDateString('ru-RU'));
                
                // Historical wins
                const reportsThisWeek = dailyAnalysisReports.filter(report => weekDates.includes(report.date));
                const historicalWins = reportsThisWeek.filter(report => {
                  if (report.completedSystemIds && Array.isArray(report.completedSystemIds)) {
                    return report.completedSystemIds.includes(sys.id);
                  }
                  if (report.completedSystemNames && Array.isArray(report.completedSystemNames)) {
                    return report.completedSystemNames.includes(sys.title);
                  }
                  return false;
                }).length;

                // Today's win status (if today is in the current week)
                const todayStr = new Date().toLocaleDateString('ru-RU');
                const isTodayInWeek = weekDates.includes(todayStr);
                const isCompletedToday = sys.milestones && sys.milestones.length > 0 && sys.milestones.every(m => m.done);
                const todaysWin = (isTodayInWeek && isCompletedToday) ? 1 : 0;

                const completions = historicalWins + todaysWin;
                
                // Days that are either logged or represent today
                const loggedDays = reportsThisWeek.map(r => r.date);
                if (isTodayInWeek && !loggedDays.includes(todayStr)) {
                  loggedDays.push(todayStr);
                }
                
                // Fallback to average weeks or at least 1 day
                const totalDaysLoggedThisWeek = Math.max(loggedDays.length, 1);
                const percentage = Math.round((completions / totalDaysLoggedThisWeek) * 100);
                
                return {
                  percentage,
                  completions,
                  totalLoggedDays: totalDaysLoggedThisWeek
                };
              };

              // Analyze repeating triggers
              const allSystemReasons = dailyAnalysisReports.map(r => r.systemReasons).filter(Boolean).join(' ').toLowerCase();
              const allPathReasons = dailyAnalysisReports.map(r => r.pathReasons).filter(Boolean).join(' ').toLowerCase();
              const allIdealReasons = dailyAnalysisReports.map(r => r.idealDayReasons).filter(Boolean).join(' ').toLowerCase();
              const fullTextReasons = `${allSystemReasons} ${allPathReasons} ${allIdealReasons}`;

              const foundFatigue = fullTextReasons.includes('устал') || fullTextReasons.includes('лень') || fullTextReasons.includes('сон') || fullTextReasons.includes('энерг') || fullTextReasons.includes('дом') || fullTextReasons.includes('устал');
              const foundWorkOverload = fullTextReasons.includes('работ') || fullTextReasons.includes('делк') || fullTextReasons.includes('задержал') || fullTextReasons.includes('форс') || fullTextReasons.includes('звон') || fullTextReasons.includes('работа');
              const foundTimeIssues = fullTextReasons.includes('время') || fullTextReasons.includes('через') || fullTextReasons.includes('позд');

              return (
                <div className="p-4 space-y-5 text-left pb-24">
                  
                  {/* Header sticky bar */}
                  <div className="flex justify-between items-center text-slate-800 sticky top-0 bg-[#f8f9fa] z-20 pb-1.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <BarChart3 size={16} className="text-[#24389c]" />
                      <h3 className="text-slate-800 font-extrabold text-sm">Рефлексивный Анализ</h3>
                    </div>
                    <div className="flex gap-2.5">
                      <button 
                        onClick={() => {
                          setShowPushNotification(true);
                          showToast('🔔 Симуляция push-уведомления вечернего анализа!');
                        }}
                        className="p-1 px-1.5 bg-indigo-50 hover:bg-indigo-100 text-[#24389c] text-[9px] font-extrabold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                        title="Симулировать пуш-напоминание"
                      >
                        Тест пуша
                      </button>
                    </div>
                  </div>

                  {/* Sub Header date titles banner */}
                  <div className="space-y-1">
                    <span className="text-[8px] font-extrabold text-indigo-700 tracking-widest uppercase">Эволюционная оценка</span>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                      Твоя <span className="text-[#24389c]">осознанность</span> строит путь.
                    </h2>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Анализируй причины невыполнения задач, чтобы адаптировать ритм идеального дня и расти быстрее.
                    </p>
                  </div>

                  {/* Pill Segment switcher */}
                  <div className="bg-slate-100/80 p-1 rounded-xl flex">
                    <button
                      onClick={() => setAnalysisSubTab('daily')}
                      className={`flex-1 py-1.5 text-center font-extrabold text-xs rounded-lg transition-all ${
                        analysisSubTab === 'daily'
                          ? 'bg-white text-[#24389c] shadow-3xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      🌙 Анализ дня
                    </button>
                    <button
                      onClick={() => setAnalysisSubTab('weekly')}
                      className={`flex-1 py-1.5 text-center font-extrabold text-xs rounded-lg transition-all ${
                        analysisSubTab === 'weekly'
                          ? 'bg-white text-[#24389c] shadow-3xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      📅 Анализ недели
                    </button>
                  </div>

                  {/* SUB-TAB 1: DAILY ANALYSIS */}
                  {analysisSubTab === 'daily' && (
                    <div className="space-y-4">
                      
                      {/* 1. DAILY DISCIPLINE GAUGE */}
                      <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-3xs text-left space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-extrabold text-[#24389c] tracking-wider uppercase block">Уровень Дисциплины Дня</span>
                            <h4 className="text-sm font-extrabold text-slate-850 mt-0.5">
                              {todayProgress >= 90 ? 'Безупречно ✨' : todayProgress >= 70 ? 'Высокий уровень ⚡' : todayProgress >= 45 ? 'Умеренный фокус 🎯' : 'Старайся больше 🎯'}
                            </h4>
                          </div>
                          <span className="text-2xl font-black text-[#24389c]">{todayProgress}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#24389c] to-indigo-500 rounded-full transition-all duration-700" style={{ width: `${todayProgress}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-550 text-slate-400 font-bold leading-normal">
                          Рассчитывается пропорционально из закрытых задач Систем, идеального ритма и дел дня.
                        </p>
                      </div>

                      {/* 2. COMPLETION SUMMARY ANALYSIS */}
                      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xs space-y-3 relative overflow-hidden">
                        <div className="absolute top-2 right-2 w-16 h-16 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
                        <div className="flex justify-between items-start">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-extrabold text-slate-400 tracking-wider">СОСТОЯНИЕ СИСТЕМ СЕГОДНЯ</span>
                            <h4 className="text-sm font-extrabold">Закрыто систем: {completedSystems.length} из {systems.length}</h4>
                          </div>
                          <span className="text-xl font-black text-emerald-400">
                            {completedSystems.length}/{systems.length}
                          </span>
                        </div>

                        {/* List of systems for today */}
                        <div className="space-y-1.5 pt-1.5 border-t border-zinc-805">
                          {systems.map(sys => {
                            const isSysDone = sys.milestones && sys.milestones.length > 0 && sys.milestones.every(m => m.done);
                            return (
                              <div key={sys.id} className="flex justify-between items-center text-[11px]">
                                <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                                  <span>{isSysDone ? '🟢' : '⚫'}</span> {sys.title}
                                </span>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                  isSysDone ? 'bg-emerald-950/80 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
                                }`}>
                                  {isSysDone ? 'Выполнена' : 'Не закрыта'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* 3. LIST OF UNCOMPLETED ITEMS FOR REASON-TRACKING */}
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                          <h4 className="text-xs font-extrabold text-slate-800">Пропущенные сегодня задачи:</h4>
                          <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded">
                            {uncompletedSystemTasks.length + uncompletedPath.length + uncompletedIdeal.length} задач
                          </span>
                        </div>

                        {/* Uncompleted system tasks */}
                        {uncompletedSystemTasks.length > 0 && (
                          <div className="space-y-1">
                            <h5 className="text-[10px] font-extrabold text-[#24389c] uppercase">Задачи систем:</h5>
                            <div className="pl-3 border-l-2 border-indigo-200/50 space-y-1">
                              {uncompletedSystemTasks.map((t, idx) => (
                                <p key={idx} className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                                  <span className="text-rose-500">✕</span> {t.title}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Uncompleted path items */}
                        {uncompletedPath.length > 0 && (
                          <div className="space-y-1">
                            <h5 className="text-[10px] font-extrabold text-teal-600 uppercase">Задачи дня:</h5>
                            <div className="pl-3 border-l-2 border-teal-200/50 space-y-1">
                              {uncompletedPath.map((p, idx) => (
                                <p key={idx} className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                                  <span className="text-rose-500">✕</span> {p.title}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Uncompleted ideal day blocks */}
                        {uncompletedIdeal.length > 0 && (
                          <div className="space-y-1">
                            <h5 className="text-[10px] font-extrabold text-amber-600 uppercase">Идеальный день (Ритмы):</h5>
                            <div className="pl-3 border-l-2 border-amber-200/50 space-y-1">
                              {uncompletedIdeal.map((tb, idx) => (
                                <p key={idx} className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                                  <span className="text-rose-500">✕</span> {tb.title} ({tb.time})
                                </p>
                              ))}
                            </div>
                          </div>
                        )}

                        {uncompletedSystemTasks.length === 0 && uncompletedPath.length === 0 && uncompletedIdeal.length === 0 && (
                          <div className="p-4 bg-emerald-50 rounded-xl text-center space-y-1.5">
                            <p className="text-xs font-extrabold text-emerald-800">🎉 Потрясающе! Все цели дня достигнуты!</p>
                            <p className="text-[10px] text-emerald-600">Нет пропущенных блоков и системных задач. Шаг совершенной дисциплины.</p>
                          </div>
                        )}
                      </div>

                      {/* 4. INPUT REASON FIELDS */}
                      {(uncompletedSystemTasks.length > 0 || uncompletedPath.length > 0 || uncompletedIdeal.length > 0) && (
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs text-left space-y-3">
                          <h4 className="text-xs font-extrabold text-[#24389c] border-b border-slate-50 pb-1.5 flex items-center justify-between">
                            <span>Общий итог и рефлексия дня:</span>
                          </h4>
                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold text-slate-500 uppercase">Что помешало закрыть день полностью?</label>
                            <textarea
                              value={dailyUnmetReason}
                              onChange={(e) => setDailyUnmetReason(e.target.value)}
                              className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-[#24389c] bg-slate-50/50 placeholder-slate-400 text-slate-800 min-h-[75px]"
                              placeholder="Например: Нехватка энергии из-за качества сна, затянулись рабочие встречи вечером..."
                            />
                          </div>
                        </div>
                      )}

                      {/* 5. SUBMIT ACTION BUTTON */}
                      <button
                        onClick={handleSaveDailyAnalysis}
                        className="w-full py-4 bg-[#24389c] hover:bg-[#1f2f84] text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer tracking-wider uppercase transition-all"
                      >
                        Зафиксировать отчет дня
                      </button>

                    </div>
                  )}

                  {/* SUB-TAB 2: WEEKLY ANALYSIS */}
                  {analysisSubTab === 'weekly' && (
                    <div className="space-y-4">
                      
                      {/* 1. WEEKLY PROGRESS BAR & METRICS */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">ОЦЕНКА ПРОДУКТИВНОСТИ НЕДЕЛИ</span>
                            <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">Уровень Дисциплины</h4>
                          </div>
                          <span className="text-3xl font-black text-[#24389c]">{weeklyProgress}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#24389c] rounded-full transition-all duration-700" style={{ width: `${weeklyProgress}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                          <span>Шагов успешно выполнено: {totalDone}</span>
                          <span>Всего вызовов в планах: {totalRequired}</span>
                        </div>
                      </div>

                      {/* 1.5 INTERACTIVE CALENDAR SECTION FOR LONG-TERM TRACKING */}
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                          <div>
                            <span className="text-[9px] font-extrabold text-[#24389c] uppercase tracking-widest block">КАЛЕНДАРЬ РЕФЛЕКСИИ</span>
                            <h4 className="text-xs font-black text-slate-900">Выбери день недели:</h4>
                          </div>
                          <span className="text-[9px] font-extrabold text-slate-500 bg-slate-100 p-1 px-2.5 rounded-lg">
                            Июнь 2026
                          </span>
                        </div>

                        {/* 7 Days Row */}
                        <div className="grid grid-cols-7 gap-1 pt-1 select-none">
                          {getWeekDates().map((day, i) => {
                            const dateStr = day.toLocaleDateString('ru-RU');
                            const dayNum = day.getDate();
                            const dayLabel = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][i];
                            const isToday = dateStr === new Date().toLocaleDateString('ru-RU');
                            const report = dailyAnalysisReports.find(r => r.date === dateStr);
                            const isSelected = selectedCalendarDay === dateStr;

                            return (
                              <div 
                                key={i}
                                onClick={() => {
                                  setSelectedCalendarDay(dateStr);
                                  showToast(`📅 Календарь: выбран ${dateStr}`);
                                }}
                                className={`flex flex-col items-center gap-1 p-1 rounded-xl transition-all cursor-pointer ${
                                  isSelected 
                                    ? 'bg-indigo-50 border border-[#24389c]/40' 
                                    : 'hover:bg-slate-50 border border-transparent'
                                }`}
                              >
                                <span className={`text-[8.5px] font-extrabold truncate ${
                                  isSelected ? 'text-[#24389c]' : 'text-slate-400'
                                }`}>
                                  {dayLabel}
                                </span>
                                <div className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                                  isSelected 
                                    ? 'bg-[#24389c] text-white border-[#24389c] font-black' 
                                    : report 
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-500 font-extrabold' 
                                      : isToday
                                        ? 'bg-indigo-50 text-indigo-800 border-indigo-400 font-bold'
                                        : 'bg-zinc-50 border-slate-200 text-slate-600'
                                }`}>
                                  <span className="text-[10.5px] font-extrabold">{dayNum}</span>
                                </div>
                                <div className="h-1 flex items-center justify-center">
                                  {report ? (
                                    <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                                  ) : isToday ? (
                                    <span className="w-1 h-1 bg-indigo-500 rounded-full" />
                                  ) : null}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Selected day summary details */}
                        <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 mt-1 text-xs text-slate-700 space-y-2 text-left">
                          {(() => {
                            const activeReport = dailyAnalysisReports.find(r => r.date === selectedCalendarDay);
                            const isSelectedToday = selectedCalendarDay === new Date().toLocaleDateString('ru-RU');

                            if (activeReport) {
                              return (
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center font-extrabold text-[10.5px] border-b border-indigo-100/50 pb-1.5 text-slate-800">
                                    <span className="flex items-center gap-1 text-[#24389c]">
                                      📝 Анализ за {selectedCalendarDay}
                                    </span>
                                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[9px] font-black uppercase">
                                      {activeReport.completedSystems} из {activeReport.totalSystems} Систем
                                    </span>
                                  </div>

                                  <div className="space-y-2.5 pt-1">
                                    <div>
                                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Невыполненные задачи систем:</p>
                                      {activeReport.uncompletedSystemTasks && activeReport.uncompletedSystemTasks.length > 0 ? (
                                        <div className="space-y-1 mt-1">
                                          {activeReport.uncompletedSystemTasks.map((t: string, idx: number) => (
                                            <p key={idx} className="text-[10.5px] text-red-650 font-bold pl-2 border-l-2 border-red-500">
                                              ✗ {t}
                                            </p>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-[10.5px] text-emerald-600 font-black pl-2 border-l-2 border-emerald-500 mt-1">✓ Все системы закрыты на 100%!</p>
                                      )}
                                    </div>

                                    <div className="pt-2 border-t border-slate-150">
                                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Пропущенные обычные задачи:</p>
                                      {activeReport.uncompletedPathItems && activeReport.uncompletedPathItems.length > 0 ? (
                                        <div className="space-y-1 mt-1">
                                          {activeReport.uncompletedPathItems.map((t: string, idx: number) => (
                                            <p key={idx} className="text-[10.5px] text-slate-750 font-bold pl-2 border-l-2 border-slate-350">
                                              ✗ {t}
                                            </p>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-[10.5px] text-emerald-600 font-black pl-2 border-l-2 border-emerald-500 mt-1">✓ Все задачи на день завершены!</p>
                                      )}
                                    </div>

                                    <div className="pt-2 border-t border-slate-150">
                                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Пропущенные ритм-блоки:</p>
                                      {activeReport.uncompletedIdealDayBlocks && activeReport.uncompletedIdealDayBlocks.length > 0 ? (
                                        <div className="space-y-1 mt-1">
                                          {activeReport.uncompletedIdealDayBlocks.map((t: string, idx: number) => (
                                            <p key={idx} className="text-[10.5px] text-slate-700 font-bold pl-2 border-l-2 border-slate-300">
                                              ✗ {t}
                                            </p>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-[10.5px] text-emerald-600 font-black pl-2 border-l-2 border-emerald-500 mt-1">✓ Ритм идеального дня соблюден!</p>
                                      )}
                                    </div>

                                    {/* Common Skip Reason specified completely */}
                                    {(activeReport.systemReasons || activeReport.pathReasons || activeReport.idealDayReasons) && (
                                      <div className="pt-2.5 border-t border-slate-150 mt-2 space-y-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Что помешало закрыть день полностью:</p>
                                        <p className="text-[10.5px] text-zinc-700 font-medium italic bg-white p-2 px-2.5 rounded-xl border border-slate-100 leading-normal">
                                          {activeReport.systemReasons || activeReport.pathReasons || activeReport.idealDayReasons}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            } else if (isSelectedToday) {
                              return (
                                <div className="text-center py-2.5 space-y-1.5">
                                  <p className="font-extrabold text-indigo-950 text-[11px]">Сегодня ({selectedCalendarDay}) еще не зафиксировано</p>
                                  <p className="text-[10px] text-slate-500 leading-relaxed">
                                    Отчет за сегодня находится в процессе наполнения. Для вековой архивации перейдите во вкладку <strong>«🌙 Анализ дня»</strong>, заполните причины невыполнения и нажмите <strong>«Зафиксировать отчет дня»</strong>.
                                  </p>
                                </div>
                              );
                            } else {
                              return (
                                <div className="text-center py-4 space-y-1 text-slate-400">
                                  <HelpCircle size={15} className="mx-auto text-slate-300" />
                                  <p className="font-bold text-slate-500 text-[11px]">Нет рефлексивных записей за этот день</p>
                                  <p className="text-[9.5px] leading-relaxed max-w-[85%] mx-auto">Дисциплинарная оценка за {selectedCalendarDay} не зафиксирована разработчиком.</p>
                                </div>
                              );
                            }
                          })()}
                        </div>
                      </div>

                      {/* 3. LIST OF SYSTEMS STATUS SUMMARY */}
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs space-y-2.5 text-xs">
                        <label className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block ml-0.5">УДЕРЖАНИЕ СИСТЕМ ЗА ЭТУ НЕДЕЛЮ</label>
                        <div className="space-y-2">
                          {systems.map((sys) => {
                            const ret = getSystemRetentionThisWeek(sys);
                            return (
                              <div key={sys.id} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100/60">
                                <div className="max-w-[65%]">
                                  <p className="font-bold text-slate-850 truncate">{sys.title}</p>
                                  <p className="text-[9px] text-slate-400">Закрыто дней: <strong>{ret.completions} из {ret.totalLoggedDays}</strong> • Сильно!</p>
                                </div>
                                <span className="font-extrabold text-indigo-750 text-right shrink-0">
                                  {ret.percentage}% удержание
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* 4. WEEKLY REFLECTION USER INPUT FORM */}
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs space-y-4">
                        <h4 className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2">Общий итог и рефлексия недели:</h4>
                        
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-extrabold text-slate-400 uppercase">ЧТО СРАБОТАЛО ЛУЧШЕ ВСЕГО НА НЕДЕЛЕ?</label>
                          <textarea
                            value={weeklyReflection}
                            onChange={(e) => setWeeklyReflection(e.target.value)}
                            className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-[#24389c] bg-slate-50/50 text-slate-850 min-h-[64px]"
                            placeholder="Опишите ваши ключевые инсайты дисциплины..."
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] font-extrabold text-slate-400 uppercase">ПЛАН ИЗМЕНЕНИЙ ИУЛУЧШЕНИЯ ПРОДУКТИВНОСТИ</label>
                          <textarea
                            value={weeklyPlanForImprovement}
                            onChange={(e) => setWeeklyPlanForImprovement(e.target.value)}
                            className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:outline-[#24389c] bg-slate-50/50 text-slate-850 min-h-[64px]"
                            placeholder="Например: перенесу английский на утро, добавлю спортивный буфер..."
                          />
                        </div>
                      </div>

                      {/* 5. SUBMIT ACTION BUTTON */}
                      <button
                        onClick={handleSaveWeeklyAnalysis}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer tracking-wider uppercase transition-all"
                      >
                        Зафиксировать анализ недели в архив
                      </button>

                      {/* 6. WEEKLY REPORTS HISTORY LOG */}
                      {weeklyAnalysisReports.length > 0 && (
                        <div className="space-y-2.5 pt-1">
                          <p className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase pl-1.5">АРХИВ ЕЖЕНЕДЕЛЬНОЙ АНАЛИТИКИ</p>
                          <div className="space-y-2">
                            {weeklyAnalysisReports.map((item, idx) => {
                              const isExpanded = expandedWeeklyIndexes.includes(idx);
                              return (
                                <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-3xs overflow-hidden transition-all text-left">
                                  {/* Header clickable zone */}
                                  <div 
                                    onClick={() => {
                                      setExpandedWeeklyIndexes(prev => 
                                        prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
                                      );
                                    }}
                                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors select-none"
                                  >
                                    <div className="flex items-center gap-2">
                                      {isExpanded ? <ChevronUp size={13} className="text-slate-400" /> : <ChevronDown size={13} className="text-slate-400" />}
                                      <strong className="text-slate-800 font-extrabold text-[11.5px]">{item.weekRange}</strong>
                                    </div>
                                    
                                    <div className="flex items-center gap-2.5">
                                      <span className="text-emerald-600 font-extrabold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-md">
                                        {item.overallProductivity}%
                                      </span>
                                      
                                      {/* Delete button */}
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (confirm(`Вы уверены, что хотите безвозвратно удалить архив за неделю «${item.weekRange}»?`)) {
                                            setWeeklyAnalysisReports(prev => prev.filter((_, i) => i !== idx));
                                            setExpandedWeeklyIndexes(prev => prev.filter(i => i !== idx).map(i => i > idx ? i - 1 : i));
                                            showToast('🗑️ Отчет удален из архива');
                                          }
                                        }}
                                        className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                                        title="Удалить архив"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Expanded content */}
                                  {isExpanded && (
                                    <div className="p-3.5 pt-0 border-t border-slate-50 bg-slate-50/40 text-xs space-y-2.5">
                                      <div className="space-y-0.5 mt-2.5">
                                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">РЕФЛЕКСИЯ И ИТОГИ:</span>
                                        <p className="text-slate-600 leading-normal pl-0.5 text-[11px]">
                                          {item.reflection}
                                        </p>
                                      </div>
                                      
                                      <div className="space-y-0.5 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100">
                                        <span className="text-[9px] font-extrabold text-[#24389c] uppercase tracking-wider block">ДИСЦИПЛИНАРНЫЙ ПЛАН:</span>
                                        <p className="text-[#24389c] text-[10.5px] font-bold leading-normal pl-0.5">
                                          {item.improvementPlan}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              );
            })()}

            {/* 7.5 PERSONAL USER CABINET SCREEN */}
            {currentScreen === 'profile' && (() => {
              const handleExportBackup = () => {
                try {
                  const archive = {
                    version: '1.0.0',
                    appName: 'Ascendant Life',
                    timestamp: new Date().toISOString(),
                    systems,
                    goals,
                    pathItems,
                    completedTimeBlocks,
                    dailyAnalysisReports,
                    weeklyAnalysisReports,
                    userPhoto,
                    userFio,
                    userAge,
                    userVision,
                    analysisReminderTime,
                  };
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(archive, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute("href", dataStr);
                  downloadAnchor.setAttribute("download", `ascendant_life_decadal_backup_${new Date().toISOString().split('T')[0]}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                  showToast('💾 Бэкап успешно выгружен на устройство в JSON!');
                } catch (e) {
                  console.error(e);
                  showToast('❌ Ошибка экспорта архива');
                }
              };

              const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
                const fileReader = new FileReader();
                const file = event.target.files?.[0];
                if (!file) return;

                fileReader.onload = (e) => {
                  try {
                    const parsed = JSON.parse(e.target?.result as string);
                    if (!parsed.systems && !parsed.dailyAnalysisReports) {
                      showToast('❌ Невалидный файл резервной копии');
                      return;
                    }
                    // Load into states
                    if (parsed.systems) setSystems(parsed.systems);
                    if (parsed.goals) setGoals(parsed.goals);
                    if (parsed.pathItems) setPathItems(parsed.pathItems);
                    if (parsed.completedTimeBlocks) setCompletedTimeBlocks(parsed.completedTimeBlocks);
                    if (parsed.dailyAnalysisReports) setDailyAnalysisReports(parsed.dailyAnalysisReports);
                    if (parsed.weeklyAnalysisReports) setWeeklyAnalysisReports(parsed.weeklyAnalysisReports);
                    if (parsed.userPhoto) setUserPhoto(parsed.userPhoto);
                    if (parsed.userFio) setUserFio(parsed.userFio);
                    if (parsed.userAge) setUserAge(Number(parsed.userAge));
                    if (parsed.userVision) setUserVision(parsed.userVision);
                    if (parsed.analysisReminderTime) setAnalysisReminderTime(parsed.analysisReminderTime);

                    showToast('🎉 Все данные успешно восстановлены из бэкапа!');
                    setIsEditingProfile(false);
                  } catch (err) {
                    console.error(err);
                    showToast('❌ Сбой чтения JSON файла');
                  }
                };
                fileReader.readAsText(file);
              };

              const avatarPresets = [
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
                'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200'
              ];

              return (
                <div className="p-4 space-y-5 text-left pb-24">
                  
                  {/* Sticky Header */}
                  <div className="flex justify-between items-center text-slate-800 py-1 sticky top-0 bg-[#f8f9fa] z-10 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-[#24389c]" />
                      <span className="font-extrabold text-[#24389c] text-sm">Личный Кабинет</span>
                    </div>
                    <button 
                      onClick={() => onScreenChange('today')}
                      className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer"
                    >
                      Назад
                    </button>
                  </div>

                  {/* 1. MAIN AVATAR / PROFILE CARD */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-4">
                    <div className="flex gap-4 items-center">
                      <div className="relative group shrink-0">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#24389c] bg-indigo-50 flex items-center justify-center">
                          <img 
                            src={userPhoto} 
                            alt={userFio} 
                            onError={(e) => {
                              // fallback
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
                            }}
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-[#24389c] text-white p-1 rounded-full border border-white shadow-xs">
                          <Camera size={10} />
                        </div>
                      </div>

                      <div className="space-y-0.5 flex-grow">
                        {!isEditingProfile ? (
                          <>
                            <h3 className="text-base font-extrabold text-slate-900 leading-tight flex items-center gap-1.5">
                              {userFio}
                            </h3>
                            <p className="subtitle text-xs text-slate-550">
                              Возраст: <strong>{userAge} лет</strong> • Сталкер Судьбы
                            </p>
                            <button
                              onClick={() => setIsEditingProfile(true)}
                              className="text-[10px] font-black tracking-wider text-[#24389c] bg-indigo-50 px-2 py-0.5 mt-1.5 rounded uppercase hover:bg-slate-100 transition-colors"
                            >
                              Изменить данные
                            </button>
                          </>
                        ) : (
                          <div className="space-y-2 w-full pt-1">
                            <input 
                              type="text" 
                              value={userFio} 
                              onChange={(e) => {
                                setUserFio(e.target.value);
                                localStorage.setItem('al_user_fio', e.target.value);
                              }}
                              className="w-full text-xs p-1.5 border border-slate-200 rounded-lg bg-slate-50 font-bold focus:outline-indigo-500 text-slate-900"
                              placeholder="ФИО Пользователя"
                            />
                            <div className="flex gap-2">
                              <input 
                                type="number" 
                                value={userAge} 
                                onChange={(e) => {
                                  const val = Number(e.target.value) || 0;
                                  setUserAge(val);
                                  localStorage.setItem('al_user_age', String(val));
                                }}
                                className="w-1/3 text-xs p-1.5 border border-slate-200 rounded-lg bg-slate-50 font-bold focus:outline-indigo-500 text-slate-900"
                                placeholder="Возраст"
                              />
                              <input 
                                type="text" 
                                value={userPhoto} 
                                onChange={(e) => {
                                  setUserPhoto(e.target.value);
                                  localStorage.setItem('al_user_photo', e.target.value);
                                }}
                                className="w-2/3 text-xs p-1.5 border border-slate-200 rounded-lg bg-slate-50 font-bold focus:outline-indigo-500 text-slate-900"
                                placeholder="Ссылка на фото или аватар"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Presets Row if in Edit mode */}
                    {isEditingProfile && (
                      <div className="pt-2 border-t border-slate-50 space-y-2">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Выбери быстрый аватар-пресет:</p>
                        <div className="flex gap-2.5 items-center">
                          {avatarPresets.map((pr, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setUserPhoto(pr);
                                localStorage.setItem('al_user_photo', pr);
                                showToast('📸 Пресет аватара выбран!');
                              }}
                              className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                                userPhoto === pr ? 'border-[#24389c] scale-110 shadow-xs' : 'border-slate-200 opacity-70 hover:opacity-100'
                              }`}
                            >
                              <img src={pr} className="w-full h-full object-cover" alt="" />
                            </button>
                          ))}
                          <button
                            onClick={() => {
                              setIsEditingProfile(false);
                              showToast('💾 Профиль зафиксирован!');
                            }}
                            className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase p-1.5 px-3 rounded-lg leading-[12px] cursor-pointer"
                          >
                            Готово
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. VISION OF THE DREAM LIFE (VISION MAP) */}
                  <div className="bg-gradient-to-br from-amber-50/70 to-orange-50/30 p-4 rounded-xl border border-amber-150 shadow-3xs space-y-2">
                    <div className="flex items-center gap-1.5 text-amber-950 border-b border-amber-150 pb-1.5">
                      <Sparkles size={13} className="text-amber-700 fill-amber-500" />
                      <h4 className="font-extrabold text-xs uppercase tracking-wider">🌠 Жизнь Моей Мечты: Дальнее Видение</h4>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Опишите образ жизни вашей мечты во всех деталях. К какому качеству жизни, навыкам и идеальному балансу здоровья вы стремитесь каждый день через внедрение ваших систем.
                    </p>
                    <textarea
                      value={userVision}
                      onChange={(e) => {
                        setUserVision(e.target.value);
                        localStorage.setItem('al_user_vision', e.target.value);
                      }}
                      className="w-full text-xs p-3.5 rounded-xl border border-amber-200 focus:outline-[#24389c] bg-white text-slate-800 min-h-[110px] leading-relaxed relative z-1"
                      placeholder="Опишите ваши ключевые ориентиры, доходы, международный уровень IT-продуктов, сильное выносливое тело и полную внутреннюю свободу перемещений..."
                    />
                  </div>

                  {/* 3. ALARM REMINDERS NOTIFICATION SYSTEM */}
                  <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-3xs space-y-4">
                    <div className="border-b border-slate-50 pb-2 flex justify-between items-center">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">СИСТЕМА НАПОМИНАНИЙ</span>
                        <h4 className="text-xs font-black text-[#24389c]">Утренние и вечерние сигналы</h4>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                        Встроенные пуши
                      </span>
                    </div>

                    <p className="text-[10.5px] text-slate-500 leading-normal">
                      Настройте сигналы для утреннего планирования верного дня и вечернего рефлексивного анализа систем дисциплины.
                    </p>

                    {/* MORNING REMINDER CONTROL */}
                    <div className="space-y-2.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          🌅 Утренний Сигнал
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const nextState = !isMorningReminderActive;
                            setIsMorningReminderActive(nextState);
                            localStorage.setItem('al_is_morning_reminder_active', String(nextState));
                            showToast(nextState ? '🌅 Утреннее напоминание включено!' : '🌅 Утреннее напоминание отключено');
                          }}
                          className={`px-3 py-1 rounded-xl text-[10px] font-extrabold cursor-pointer transition-all ${
                            isMorningReminderActive 
                              ? 'bg-emerald-500 text-white shadow-3xs' 
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {isMorningReminderActive ? 'Включен ✓' : 'Выключен ✕'}
                        </button>
                      </div>
                      
                      {isMorningReminderActive && (
                        <div className="flex gap-2 items-center bg-white p-2 rounded-lg border border-slate-100">
                          <Bell size={13} className="text-[#24389c]" />
                          <div className="flex-grow">
                            <p className="text-[10.5px] font-bold text-slate-700">Начать день по плану</p>
                            <p className="text-[9.5px] text-slate-400">Каждый день в <strong>{morningReminderTime}</strong></p>
                          </div>
                          <input 
                            type="time" 
                            value={morningReminderTime}
                            onChange={(e) => {
                              setMorningReminderTime(e.target.value);
                              localStorage.setItem('al_morning_reminder_time', e.target.value);
                              showToast(`🌅 Утренний сигнал установлен на ${e.target.value}`);
                            }}
                            className="text-xs px-2 py-1 select-none cursor-pointer border border-slate-200 rounded-lg bg-slate-50 font-black text-[#24389c]" 
                          />
                        </div>
                      )}
                    </div>

                    {/* EVENING REMINDER CONTROL */}
                    <div className="space-y-2.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          🌙 Вечерний Сигнал
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const nextState = !isEveningReminderActive;
                            setIsEveningReminderActive(nextState);
                            localStorage.setItem('al_is_evening_reminder_active', String(nextState));
                            showToast(nextState ? '🌙 Вечернее напоминание включено!' : '🌙 Вечернее напоминание отключено');
                          }}
                          className={`px-3 py-1 rounded-xl text-[10px] font-extrabold cursor-pointer transition-all ${
                            isEveningReminderActive 
                              ? 'bg-[#24389c] text-white shadow-3xs' 
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {isEveningReminderActive ? 'Включен ✓' : 'Выключен ✕'}
                        </button>
                      </div>
                      
                      {isEveningReminderActive && (
                        <div className="flex gap-2 items-center bg-white p-2 rounded-lg border border-slate-100">
                          <Bell size={13} className="text-[#24389c]" />
                          <div className="flex-grow">
                            <p className="text-[10.5px] font-bold text-slate-700">Время вечерней рефлексии</p>
                            <p className="text-[9.5px] text-slate-450 text-slate-400">Каждый день в <strong>{analysisReminderTime}</strong></p>
                          </div>
                          <input 
                            type="time" 
                            value={analysisReminderTime}
                            onChange={(e) => {
                              setAnalysisReminderTime(e.target.value);
                              localStorage.setItem('al_reminder_time', e.target.value);
                              setHasShownTodayNotification(false);
                              showToast(`🌙 Вечерний сигнал установлен на ${e.target.value}`);
                            }}
                            className="text-xs px-2 py-1 select-none cursor-pointer border border-slate-200 rounded-lg bg-slate-50 font-black text-[#24389c]" 
                          />
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowPushNotification(false);
                        setTimeout(() => {
                          setPushNotificationText(
                            isMorningReminderActive 
                              ? '🌅 Сталкер, твой идеальный день ждет! Открой планировщик, сверься с видением.' 
                              : '🌙 Время зафиксировать отчет дня! Твоя дисциплина формирует твою свободу.'
                          );
                          setShowPushNotification(true);
                          showToast('🔔 Пуш-уведомление симулировано на экране!');
                        }, 200);
                      }}
                      className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-[#24389c] font-bold text-[10.5px] rounded-xl transition-all cursor-pointer text-center"
                    >
                      🚀 Проверить работу уведомлений (Тест)
                    </button>
                  </div>

                </div>
              );
            })()}
            {currentScreen === 'insights' && (
              <div className="p-5 space-y-6">
                
                {/* Header */}
                <div className="flex justify-between items-center text-slate-800 py-2 sticky top-0 bg-[#f8f9fa] z-10">
                  <div className="flex items-center gap-2">
                    <div 
                      onClick={() => onScreenChange('profile')}
                      className="w-8 h-8 rounded-full bg-indigo-505 overflow-hidden flex items-center justify-center border border-[#24389c] cursor-pointer hover:opacity-90 active:scale-95 transition-all shrink-0"
                    >
                      <img 
                        src={userPhoto} 
                        alt="Profile avatar" 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200';
                        }}
                      />
                    </div>
                    <span className="font-extrabold text-[#24389c] text-sm text-left">Аналитика</span>
                  </div>
                  <button 
                    onClick={() => onScreenChange('today')}
                    className="text-xs font-bold text-indigo-700 hover:text-indigo-800"
                  >
                    Назад
                  </button>
                </div>

                {/* Tag header */}
                <div className="space-y-1">
                  <div className="inline-flex items-center px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full gap-1">
                    <Sparkles size={12} className="fill-indigo-500" />
                    <span className="text-[9px] font-extrabold uppercase tracking-wide">ЛИЧНЫЙ КОУЧ</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Рефлексия и поток</h2>
                  <p className="text-xs text-slate-500 leading-relaxed">Твои системы выравниваются. Вот что я заметил за последние 7 дней.</p>
                </div>

                {/* Peak Performance alert analytics */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col gap-4 shadow-2xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">ПИК ПРОИЗВОДИТЕЛЬНОСТИ</span>
                    <BarChart3 size={16} className="text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold text-indigo-950 leading-tight">Ты справляешься на 42% лучше в утренних блоках.</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">Данные показывают, что ваши глубокие рабочие сессии с 07:00 до 10:00 имеют самый высокий уровень завершения и минимум отвлекающих факторов.</p>
                </div>

                {/* Quick stats items */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 rounded-2xl p-4.5 space-y-1.5 flex flex-col justify-between">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-700" />
                      <span className="text-[10px] font-bold text-emerald-800">Физическое состояние</span>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-emerald-950">+11%</p>
                      <p className="text-[10px] text-emerald-700">Прогресс в силе кора.</p>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 rounded-2xl p-4.5 space-y-1.5 flex flex-col justify-between">
                    <div className="flex items-center gap-1.5">
                      <HelpCircle size={14} className="text-indigo-700" />
                      <span className="text-[10px] font-bold text-indigo-800">Качество сна</span>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-indigo-950">8.2ч</p>
                      <p className="text-[10px] text-indigo-700">Сон нормализовался.</p>
                    </div>
                  </div>
                </div>

                {/* Adjustments systems log list */}
                <div className="space-y-3.5">
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase ml-1">Корректировка систем</h3>
                  
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs space-y-2">
                      <p className="text-xs font-bold text-slate-800">Попробуй сдвинуть блок сна на 22:30.</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">Твое время засыпания увеличивается после 23:00. Более раннее начало может облегчить ранний подъем утреннего блока.</p>
                      <button 
                        onClick={() => showToast('📅 Рекомендация добавлена в Apple Календарь!')}
                        className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full text-center hover:bg-indigo-100 mt-1 block"
                      >
                        Применить рекомендацию
                      </button>
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs space-y-2">
                      <p className="text-xs font-bold text-slate-800">Добавь 5 минут дыхательных практик после Спорта.</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">Регистрация вариабельности ритма сердца указывает на накопление легкого стресса в середине дня.</p>
                      <button 
                        onClick={() => showToast('🔔 Коуч напомнит о дыхательной практике после Спорт-блока!')}
                        className="text-[11px] font-bold text-[#24389c] bg-indigo-50 px-3 py-1 rounded-full text-center hover:bg-indigo-100 mt-1 block"
                      >
                        Напомнить позже
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* iOS Bottom Apple Style Tab Navigation Utility bar */}
          {currentScreen !== 'onboarding' && (
            <nav className="absolute bottom-0 w-full z-40 bg-white/90 backdrop-blur-md border-t border-slate-100/80 flex justify-around items-center py-2.5 pb-6 shrink-0">
              
              {/* Today */}
              <button 
                onClick={() => onScreenChange('today')}
                className={`flex flex-col items-center justify-center relative w-10 h-10 transition-all ${currentScreen === 'today' ? 'text-[#24389c] scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                title="Сегодня"
              >
                <CheckCircle2 size={18} className={currentScreen === 'today' ? "stroke-[2.5]" : "stroke-2"} />
                {currentScreen === 'today' && <span className="absolute bottom-[-3px] text-[8px] leading-none font-black text-[#24389c]">●</span>}
              </button>

              {/* Goals */}
              <button 
                onClick={() => onScreenChange('goals_list')}
                className={`flex flex-col items-center justify-center relative w-10 h-10 transition-all ${currentScreen === 'goals_list' || currentScreen === 'goal_detail' ? 'text-[#24389c] scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                title="Цели"
              >
                <Milestone size={18} className={currentScreen === 'goals_list' || currentScreen === 'goal_detail' ? "stroke-[2.5]" : "stroke-2"} />
                {(currentScreen === 'goals_list' || currentScreen === 'goal_detail') && <span className="absolute bottom-[-3px] text-[8px] leading-none font-black text-[#24389c]">●</span>}
              </button>

              {/* Systems */}
              <button 
                onClick={() => onScreenChange('systems_list')}
                className={`flex flex-col items-center justify-center relative w-10 h-10 transition-all ${currentScreen === 'systems_list' || currentScreen === 'system_detail' ? 'text-[#24389c] scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                title="Системы"
              >
                <Flame size={18} className={currentScreen === 'systems_list' || currentScreen === 'system_detail' ? "stroke-[2.5] fill-[#24389c]/10" : "stroke-2"} />
                {(currentScreen === 'systems_list' || currentScreen === 'system_detail') && <span className="absolute bottom-[-3px] text-[8px] leading-none font-black text-[#24389c]">●</span>}
              </button>

              {/* Rhythm */}
              <button 
                onClick={() => onScreenChange('ideal_day')}
                className={`flex flex-col items-center justify-center relative w-10 h-10 transition-all ${currentScreen === 'ideal_day' ? 'text-[#24389c] scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                title="Ритм"
              >
                <Coffee size={18} className={currentScreen === 'ideal_day' ? "stroke-[2.5] fill-[#24389c]/10" : "stroke-2"} />
                {currentScreen === 'ideal_day' && <span className="absolute bottom-[-3px] text-[8px] leading-none font-black text-[#24389c]">●</span>}
              </button>

              {/* Анализ */}
              <button 
                onClick={() => onScreenChange('weekly_review')}
                className={`flex flex-col items-center justify-center relative w-10 h-10 transition-all ${currentScreen === 'weekly_review' ? 'text-[#24389c] scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                title="Анализ"
              >
                <BarChart3 size={18} className={currentScreen === 'weekly_review' ? "stroke-[2.5]" : "stroke-2"} />
                {currentScreen === 'weekly_review' && <span className="absolute bottom-[-3px] text-[8px] leading-none font-black text-[#24389c]">●</span>}
              </button>

              {/* Личный кабинет (User Profile) */}
              <button 
                onClick={() => onScreenChange('profile')}
                className={`flex flex-col items-center justify-center relative w-10 h-10 transition-all ${currentScreen === 'profile' ? 'text-[#24389c] scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                title="Кабинет"
              >
                <User size={18} className={currentScreen === 'profile' ? "stroke-[2.5] fill-[#24389c]/10" : "stroke-2"} />
                {currentScreen === 'profile' && <span className="absolute bottom-[-3px] text-[8px] leading-none font-black text-[#24389c]">●</span>}
              </button>

            </nav>
          )}

          {/* STATE MODALS / HIGH FIDELITY FORMS */}
          {activeModal && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex flex-col justify-end transition-all duration-300">
              <div className="absolute inset-x-0 top-0 bottom-0 cursor-pointer" onClick={() => setActiveModal(null)} />
              
              <div className="bg-white rounded-t-[32px] w-full max-h-[85%] relative z-10 p-6 pb-8 flex flex-col shadow-2xl text-left overflow-y-auto no-scrollbar">
                {/* Micro drag bar */}
                <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5 shrink-0" />

                {activeModal === 'add_system' && (
                  <form onSubmit={submitAddSystem} className="space-y-4">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-base font-extrabold text-slate-900">Интегрировать Систему</h4>
                      <button type="button" onClick={() => setActiveModal(null)} className="text-[#24389c] hover:text-[#101c5c] text-xs font-bold">Закрыть</button>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-1">Система автоматизирует действия для регулярного повторения.</p>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Название действия</label>
                      <input 
                        type="text" 
                        value={newSysTitle} 
                        onChange={(e) => setNewSysTitle(e.target.value)} 
                        placeholder="Например: Разговорный английский, Сон" 
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Связать с целью</label>
                      <select 
                        value={newSysGoal} 
                        onChange={(e) => setNewSysGoal(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50"
                      >
                        <option value="">-- Выберите цель (Опционально) --</option>
                        {goals.map(g => (
                          <option key={g.id} value={g.title}>{g.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Цветовой маркер</label>
                      <div className="flex gap-2">
                        {['#24389c', '#006e1c', '#854d00', '#757684', '#e11d48'].map((c) => (
                          <button 
                            key={c}
                            type="button"
                            onClick={() => setNewSysColor(c)}
                            className={`w-8 h-8 rounded-full border-2 transition-transform ${newSysColor === c ? 'scale-110 border-slate-900' : 'border-transparent'}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>

                    <button type="submit" className="w-full py-3 bg-[#24389c] text-white font-bold text-xs rounded-xl shadow-md hover:bg-opacity-95 transition-all mt-3">
                      Внедрить в эволюцию
                    </button>
                  </form>
                )}

                {activeModal === 'add_goal' && (
                  <form onSubmit={submitAddGoal} className="space-y-4">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-base font-extrabold text-slate-900">Поставить Цель</h4>
                      <button type="button" onClick={() => setActiveModal(null)} className="text-[#24389c] hover:text-[#101c5c] text-xs font-bold">Закрыть</button>
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Формулировка цели</label>
                      <input 
                        type="text" 
                        value={newGoalTitle} 
                        onChange={(e) => setNewGoalTitle(e.target.value)} 
                        placeholder="Например: Финансовая независимость" 
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Подзаголовок / Специфика</label>
                      <input 
                        type="text" 
                        value={newGoalSubtitle} 
                        onChange={(e) => setNewGoalSubtitle(e.target.value)} 
                        placeholder="Фиксация: накопить 500k руб" 
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Текущий Прогресс (%)</label>
                        <input 
                          type="number" 
                          min="0" 
                          max="100"
                          value={newGoalProgress} 
                          onChange={(e) => setNewGoalProgress(Number(e.target.value))}
                          className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Иконка</label>
                        <select 
                          value={newGoalIcon} 
                          onChange={(e) => setNewGoalIcon(e.target.value)}
                          className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50"
                        >
                          <option value="brain">Мозг (brain)</option>
                          <option value="dumbbell">Спорт (dumbbell)</option>
                          <option value="dollar">Деньги (dollar)</option>
                          <option value="globe">Мировое (globe)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Категория цвета</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['primary', 'secondary', 'tertiary'].map((colorName) => (
                          <button
                            key={colorName}
                            type="button"
                            onClick={() => setNewGoalColor(colorName)}
                            className={`py-2 px-2 rounded-lg border text-[10px] font-bold uppercase ${newGoalColor === colorName ? 'bg-indigo-600 text-white border-transparent' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                          >
                            {colorName === 'primary' ? 'Indigo' : colorName === 'secondary' ? 'Green' : 'Brown'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button type="submit" className="w-full py-3 bg-[#24389c] text-white font-bold text-xs rounded-xl shadow-md hover:bg-opacity-95 transition-all mt-3">
                      Зарегистрировать цель
                    </button>
                  </form>
                )}

                {activeModal === 'add_timeblock' && (
                  <form onSubmit={submitAddTimeblock} className="space-y-4 text-left">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-base font-extrabold text-slate-900">Добавить блок времени</h4>
                      <button type="button" onClick={() => setActiveModal(null)} className="text-[#24389c] hover:text-[#101c5c] text-xs font-bold bg-transparent border-0 cursor-pointer">Закрыть</button>
                    </div>

                    {/* Time format selector */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Формат времени</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setNewTbTimeType('range')}
                          className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                            newTbTimeType === 'range' 
                              ? 'bg-indigo-550 border-indigo-550 text-white shadow-sm' 
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          🕒 Промежуток
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewTbTimeType('exact')}
                          className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                            newTbTimeType === 'exact' 
                              ? 'bg-indigo-550 border-indigo-550 text-white shadow-sm' 
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          🎯 Конкретное
                        </button>
                      </div>
                    </div>

                    {/* Time fields */}
                    {newTbTimeType === 'range' ? (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">С</label>
                          <input 
                            type="time" 
                            value={newTbTimeStart} 
                            onChange={(e) => setNewTbTimeStart(e.target.value)} 
                            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50 text-center"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">До</label>
                          <input 
                            type="time" 
                            value={newTbTimeEnd} 
                            onChange={(e) => setNewTbTimeEnd(e.target.value)} 
                            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50 text-center"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Время</label>
                        <input 
                          type="time" 
                          value={newTbTimeExact} 
                          onChange={(e) => setNewTbTimeExact(e.target.value)} 
                          className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50 text-center"
                        />
                      </div>
                    )}

                    {/* Title */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Название блока</label>
                      <input 
                        type="text" 
                        required
                        value={newTbTitle} 
                        onChange={(e) => setNewTbTitle(e.target.value)} 
                        placeholder="Например: Самообразование, Практика" 
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Описание / Задачи</label>
                      <input 
                        type="text" 
                        value={newTbDesc} 
                        onChange={(e) => setNewTbDesc(e.target.value)} 
                        placeholder="Книги, лекции, курсы" 
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50"
                      />
                    </div>

                    {/* Colors */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Цветовой маркер</label>
                      <div className="flex gap-2">
                        {['#24389c', '#006e1c', '#854d00', '#757684', '#a21caf', '#db2777'].map((c) => (
                          <button 
                            key={c}
                            type="button"
                            onClick={() => setNewTbColor(c)}
                            className={`w-8 h-8 rounded-full border-2 transition-transform ${newTbColor === c ? 'scale-110 border-slate-900 shadow-xs' : 'border-transparent'}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>

                    <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all mt-3 cursor-pointer">
                      Внедрить в расписание ({activeSegment === 'main' ? 'Основной' : activeSegment === 'weekend' ? 'Выходной' : 'Отпуск'})
                    </button>
                  </form>
                )}

                {activeModal === 'edit_timeblock' && (
                  <form onSubmit={submitEditTimeblock} className="space-y-4 text-left">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-base font-extrabold text-slate-900">Изменить блок времени</h4>
                      <button type="button" onClick={() => { setActiveModal(null); setEditingTbId(null); }} className="text-[#24389c] hover:text-[#101c5c] text-xs font-bold bg-transparent border-0 cursor-pointer">Закрыть</button>
                    </div>

                    {/* Time format selector */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Формат времени</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingTbTimeType('range')}
                          className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                            editingTbTimeType === 'range' 
                              ? 'bg-indigo-550 border-indigo-550 text-white shadow-sm' 
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          🕒 Промежуток
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingTbTimeType('exact')}
                          className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                            editingTbTimeType === 'exact' 
                              ? 'bg-indigo-550 border-indigo-550 text-white shadow-sm' 
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          🎯 Конкретное
                        </button>
                      </div>
                    </div>

                    {/* Time fields */}
                    {editingTbTimeType === 'range' ? (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">С</label>
                          <input 
                            type="time" 
                            value={editingTbTimeStart} 
                            onChange={(e) => setEditingTbTimeStart(e.target.value)} 
                            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50 text-center"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">До</label>
                          <input 
                            type="time" 
                            value={editingTbTimeEnd} 
                            onChange={(e) => setEditingTbTimeEnd(e.target.value)} 
                            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50 text-center"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Время</label>
                        <input 
                          type="time" 
                          value={editingTbTimeExact} 
                          onChange={(e) => setEditingTbTimeExact(e.target.value)} 
                          className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50 text-center"
                        />
                      </div>
                    )}

                    {/* Title */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Название блока</label>
                      <input 
                        type="text" 
                        required
                        value={editingTbTitle} 
                        onChange={(e) => setEditingTbTitle(e.target.value)} 
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Описание / Задачи</label>
                      <input 
                        type="text" 
                        value={editingTbDesc} 
                        onChange={(e) => setEditingTbDesc(e.target.value)} 
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50"
                      />
                    </div>

                    {/* Colors */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Цветовой маркер</label>
                      <div className="flex gap-2">
                        {['#24389c', '#006e1c', '#854d00', '#757684', '#a21caf', '#db2777'].map((c) => (
                          <button 
                            key={c}
                            type="button"
                            onClick={() => setEditingTbColor(c)}
                            className={`w-8 h-8 rounded-full border-2 transition-transform ${editingTbColor === c ? 'scale-110 border-slate-900 shadow-xs' : 'border-transparent'}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>

                    <button type="submit" className="w-full py-3 bg-indigo-650 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md transition-all mt-3 cursor-pointer">
                      Сохранить изменения
                    </button>
                  </form>
                )}

                {activeModal === 'add_pathitem' && (
                  <form onSubmit={submitAddPathitem} className="space-y-4 text-left">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-base font-extrabold text-slate-900">Запланировать дело</h4>
                      <button type="button" onClick={() => setActiveModal(null)} className="text-[#24389c] hover:text-[#101c5c] text-xs font-bold bg-transparent border-0 cursor-pointer">Закрыть</button>
                    </div>

                    {/* Date picker */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Дата выполнения</label>
                      <input 
                        type="date" 
                        value={newPathDate} 
                        onChange={(e) => setNewPathDate(e.target.value)} 
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50 font-medium"
                      />
                    </div>

                    {/* Time Type selector */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Формат времени</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setNewPathTimeType('range')}
                          className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                            newPathTimeType === 'range' 
                              ? 'bg-indigo-550 border-indigo-550 text-white shadow-sm' 
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          🕒 Промежуток
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewPathTimeType('exact')}
                          className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                            newPathTimeType === 'exact' 
                              ? 'bg-indigo-550 border-indigo-550 text-white shadow-sm' 
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          🎯 Конкретное
                        </button>
                      </div>
                    </div>

                    {/* Time Inputs */}
                    {newPathTimeType === 'range' ? (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">С</label>
                          <input 
                            type="time" 
                            value={newPathTimeStart} 
                            onChange={(e) => setNewPathTimeStart(e.target.value)} 
                            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50 text-center"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">До</label>
                          <input 
                            type="time" 
                            value={newPathTimeEnd} 
                            onChange={(e) => setNewPathTimeEnd(e.target.value)} 
                            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50 text-center"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Время</label>
                        <input 
                          type="time" 
                          value={newPathTimeExact} 
                          onChange={(e) => setNewPathTimeExact(e.target.value)} 
                          className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50 text-center"
                        />
                      </div>
                    )}

                    {/* Title */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Что необходимо сделать</label>
                      <input 
                        type="text" 
                        required
                        value={newPathTitle} 
                        onChange={(e) => setNewPathTitle(e.target.value)} 
                        placeholder="Например: Запись на массаж, отчет" 
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50"
                      />
                    </div>

                    <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all mt-2 cursor-pointer">
                      Запланировать дело
                    </button>
                  </form>
                )}

                {activeModal === 'edit_metrics' && (() => {
                  const isCurFitness = selectedGoalId === 'g1' || editGoalTitle.toLowerCase().includes('атлет') || editGoalTitle.toLowerCase().includes('тело') || editGoalTitle.toLowerCase().includes('спорт');
                  const isCurFinance = selectedGoalId === 'g2' || editGoalTitle.toLowerCase().includes('финанс') || editGoalTitle.toLowerCase().includes('деньг') || editGoalTitle.toLowerCase().includes('богат');
                  const isCurLang = selectedGoalId === 'g3' || editGoalTitle.toLowerCase().includes('английск') || editGoalTitle.toLowerCase().includes('язык');

                  return (
                    <form onSubmit={submitEditMetrics} className="space-y-4 text-left">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-base font-extrabold text-slate-900">Редактировать цель</h4>
                        <button type="button" onClick={() => setActiveModal(null)} className="text-[#24389c] hover:text-[#101c5c] text-xs font-bold bg-transparent border-0 cursor-pointer">Закрыть</button>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">Изменение названия цели, приоритетов, а также актуальных метрик развития.</p>
                      
                      {/* Goal Title */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Название цели</label>
                        <input 
                          type="text" 
                          required
                          value={editGoalTitle} 
                          onChange={(e) => setEditGoalTitle(e.target.value)} 
                          className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50"
                          placeholder="Например: Атлетичное тело"
                        />
                      </div>

                      {/* Goal Subtitle */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Подзаголовок / Краткое описание</label>
                        <input 
                          type="text" 
                          required
                          value={editGoalSubtitle} 
                          onChange={(e) => setEditGoalSubtitle(e.target.value)} 
                          className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50"
                          placeholder="Коротко сформулируйте ориентир"
                        />
                      </div>

                      {/* Progress and Color Row */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Прогресс ({editGoalProgress}%)</label>
                          <input 
                            type="range"
                            min="0"
                            max="100"
                            value={editGoalProgress} 
                            onChange={(e) => setEditGoalProgress(Number(e.target.value))} 
                            className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#24389c]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Стиль / Цвет</label>
                          <div className="flex gap-2">
                            {(['primary', 'secondary', 'tertiary'] as const).map((col) => (
                              <button
                                type="button"
                                key={col}
                                onClick={() => setEditGoalColor(col)}
                                className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase transition-all cursor-pointer border ${
                                  editGoalColor === col 
                                    ? 'bg-[#24389c] text-white border-[#24389c]'
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                {col === 'primary' ? 'Синий' : col === 'secondary' ? 'Зеленый' : 'Оранжевый'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Fitness Specific Metrics Form Area */}
                      {isCurFitness && (
                        <div className="border-t border-slate-150 pt-3 space-y-3">
                          <span className="text-[10px] font-bold uppercase block tracking-wider font-extrabold text-[#24389c]">Параметры здоровья & фитнеса</span>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Вес (кг)</label>
                              <input 
                                type="number" 
                                step="0.1"
                                value={editWeight} 
                                onChange={(e) => setEditWeight(Number(e.target.value))} 
                                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Динамика веса (кг)</label>
                              <input 
                                type="number" 
                                step="0.1"
                                value={editWeightDiff} 
                                onChange={(e) => setEditWeightDiff(Number(e.target.value))} 
                                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Процент жира (%)</label>
                              <input 
                                type="number" 
                                step="0.1"
                                value={editFat} 
                                onChange={(e) => setEditFat(Number(e.target.value))} 
                                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Объем талии (см)</label>
                              <input 
                                type="number" 
                                value={editWaist} 
                                onChange={(e) => setEditWaist(Number(e.target.value))} 
                                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Finance Specific Metrics Form Area */}
                      {isCurFinance && (
                        <div className="border-t border-slate-150 pt-3 space-y-3">
                          <span className="text-[10px] font-bold uppercase block tracking-wider font-extrabold text-emerald-600">Финансовые показатели</span>
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Норма сбережений (руб/мес)</label>
                              <input 
                                type="number" 
                                value={editFinanceSavings} 
                                onChange={(e) => setEditFinanceSavings(Number(e.target.value))} 
                                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Активы (тыс. руб)</label>
                                <input 
                                  type="number" 
                                  value={editFinanceAssets} 
                                  onChange={(e) => setEditFinanceAssets(Number(e.target.value))} 
                                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Расходы (тыс. руб)</label>
                                <input 
                                  type="number" 
                                  value={editFinanceExpenses} 
                                  onChange={(e) => setEditFinanceExpenses(Number(e.target.value))} 
                                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Language / English Specific Metrics Form Area */}
                      {isCurLang && (
                        <div className="border-t border-slate-150 pt-3 space-y-3">
                          <span className="text-[10px] font-bold uppercase block tracking-wider font-extrabold text-amber-600">Индикаторы усвоения языка</span>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Словарный запас (слов)</label>
                              <input 
                                type="number" 
                                value={editLangWords} 
                                onChange={(e) => setEditLangWords(Number(e.target.value))} 
                                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Практика (ч/нед)</label>
                              <input 
                                type="number" 
                                step="0.1"
                                value={editLangHours} 
                                onChange={(e) => setEditLangHours(Number(e.target.value))} 
                                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Текущий Уровень</label>
                            <input 
                              type="text" 
                              value={editLangLevel} 
                              onChange={(e) => setEditLangLevel(e.target.value)} 
                              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-[#24389c] text-slate-800 bg-slate-50"
                              placeholder="Например: B2 High"
                            />
                          </div>
                        </div>
                      )}

                      <button type="submit" className="w-full py-3 bg-[#24389c] text-white font-bold text-xs rounded-xl shadow-md hover:bg-opacity-95 transition-all mt-4">
                        Сохранить изменения
                      </button>
                    </form>
                  );
                })()}

              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
