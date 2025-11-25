import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Users, Activity, Heart, Clock, Phone, Mail, MapPin, Menu, X, ChevronRight, Star, Award, Shield, Stethoscope, Pill, Brain, Eye, CheckCircle, XCircle, Info, Sparkles } from 'lucide-react';

type Ripple = { x: number; y: number; size: number; id: number };
type FormErrors = {
  name?: string;
  email?: string;
  dept?: string;
  doctor?: string;
  date?: string;
  time?: string;
};
type Department = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  patients: number;
  description: string;
  doctors: number;
  equipment: string;
};
type Doctor = {
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  image: string;
};

const HospitalManagementSystem = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [stats, setStats] = useState({ patients: 0, doctors: 0, staff: 0, departments: 0 });
  const [formData, setFormData] = useState({ name: '', email: '', dept: '', doctor: '', date: '', time: '' });
  const [showDoctorSelection, setShowDoctorSelection] = useState(false);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | number | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [expandedDept, setExpandedDept] = useState<number | null>(null);
  const pageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const animateStats = () => {
      const targets = { patients: 15420, doctors: 248, staff: 892, departments: 24 };
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        setStats({
          patients: Math.floor(targets.patients * progress),
          doctors: Math.floor(targets.doctors * progress),
          staff: Math.floor(targets.staff * progress),
          departments: Math.floor(targets.departments * progress)
        });

        if (step >= steps) clearInterval(timer);
      }, interval);
    };

    if (currentPage === 'home') animateStats();
  }, [currentPage]);

  useEffect(() => {
    if (pageRef.current) {
      pageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  const createRipple = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const ripple: Ripple = { x, y, size, id: Date.now() };
    setRipples(prev => [...prev, ripple]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== ripple.id)), 600);
  };

  const validateForm = () => {
    const errors: FormErrors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.dept) errors.dept = 'Department is required';
    if (!formData.doctor) errors.doctor = 'Doctor selection is required';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.time) errors.time = 'Time is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const validateContactForm = () => {
    const errors: { name?: string; email?: string; subject?: string; message?: string } = {};
    if (!contactForm.name.trim()) errors.name = 'Name is required';
    if (!contactForm.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(contactForm.email)) errors.email = 'Email is invalid';
    if (!contactForm.subject.trim()) errors.subject = 'Subject is required';
    if (!contactForm.message.trim()) errors.message = 'Message is required';
    return Object.keys(errors).length === 0;
  };

  const departments = [
    { 
      name: 'Cardiology', 
      icon: Heart, 
      color: 'from-red-500 to-pink-500', 
      patients: 450,
      description: 'Comprehensive heart care with advanced cardiac procedures and diagnostics.',
      doctors: 12,
      equipment: 'ECG, Echocardiography, Cardiac Catheterization Lab'
    },
    { 
      name: 'Neurology', 
      icon: Brain, 
      color: 'from-purple-500 to-indigo-500', 
      patients: 380,
      description: 'Expert neurological care for brain and nervous system disorders.',
      doctors: 8,
      equipment: 'MRI, CT Scan, EEG, EMG'
    },
    { 
      name: 'Orthopedics', 
      icon: Activity, 
      color: 'from-blue-500 to-cyan-500', 
      patients: 520,
      description: 'Specialized treatment for bone, joint, and muscle conditions.',
      doctors: 15,
      equipment: 'X-Ray, Bone Densitometry, Arthroscopy'
    },
    { 
      name: 'Pediatrics', 
      icon: Users, 
      color: 'from-green-500 to-emerald-500', 
      patients: 620,
      description: 'Compassionate care for children from infancy through adolescence.',
      doctors: 18,
      equipment: 'Pediatric ICU, Neonatal Care Unit'
    },
    { 
      name: 'Ophthalmology', 
      icon: Eye, 
      color: 'from-yellow-500 to-orange-500', 
      patients: 340,
      description: 'Advanced eye care and vision correction services.',
      doctors: 6,
      equipment: 'Slit Lamp, Fundus Camera, Laser Surgery Unit'
    },
    { 
      name: 'Pharmacy', 
      icon: Pill, 
      color: 'from-teal-500 to-cyan-500', 
      patients: 780,
      description: '24/7 pharmacy services with prescription and OTC medications.',
      doctors: 4,
      equipment: 'Automated Dispensing System'
    }
  ];

  const doctors = [
    { name: 'Dr. Anubhav Shrivastav', specialty: 'Chief Cardiologist', experience: '15 years', rating: 4.9, image: '👩‍⚕️' },
    { name: 'Dr. Yogesh Kumar', specialty: 'Neurologist', experience: '12 years', rating: 4.8, image: '👨‍⚕️' },
    { name: 'Dr. Emily Rodriguez', specialty: 'Pediatric Specialist', experience: '10 years', rating: 4.9, image: '👩‍⚕️' },
    { name: 'Dr. Michael Kumar', specialty: 'Orthopedic Surgeon', experience: '18 years', rating: 5.0, image: '👨‍⚕️' }
  ];

  const appointments = [
    { id: 'APT001', patient: 'dev tyagi', doctor: 'Dr. Anubhav Shrivastav', time: '09:00 AM', status: 'Confirmed' },
    { id: 'APT002', patient: 'Emma Johnson', doctor: 'Dr. Yogesh Kumar', time: '10:30 AM', status: 'Pending' },
    { id: 'APT003', patient: 'Michael Brown', doctor: 'Dr. Emily Rodriguez', time: '02:00 PM', status: 'Confirmed' },
    { id: 'APT004', patient: 'Sarah Davis', doctor: 'Dr. Michael Kumar', time: '03:30 PM', status: 'Completed' }
  ];

  useEffect(() => {
    if (formData.dept) {
      const deptDoctors = doctors.filter(doc => 
        doc.specialty.toLowerCase().includes(formData.dept.toLowerCase()) ||
        formData.dept.toLowerCase().includes(doc.specialty.toLowerCase().split(' ')[0])
      );
      setFilteredDoctors(deptDoctors.length > 0 ? deptDoctors : doctors);
      setShowDoctorSelection(true);
      if (!deptDoctors.some(d => d.name === formData.doctor)) {
        setFormData(prev => ({ ...prev, doctor: '' }));
      }
    } else {
      setFilteredDoctors(doctors);
      setShowDoctorSelection(false);
    }
  }, [formData.dept, formData.doctor]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: '' });
    }
  };

  const handleContactChange = (field, value) => {
    setContactForm({ ...contactForm, [field]: value });
  };

  const handleBookAppointment = (e) => {
    if (e) createRipple(e);
    if (validateForm()) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setFormData({ name: '', email: '', dept: '', doctor: '', date: '', time: '' });
      setFormErrors({});
      setShowDoctorSelection(false);
    }
  };

  const handleContactSubmit = (e) => {
    if (e) createRipple(e);
    if (validateContactForm()) {
      setContactSuccess(true);
      setTimeout(() => setContactSuccess(false), 3000);
      setContactForm({ name: '', email: '', subject: '', message: '' });
    }
  };

  const renderHome = () => (
    <div className="min-h-screen" ref={pageRef}>
      <div className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 via-pink-500 to-orange-500 animate-gradient">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float"
              style={{
                width: Math.random() * 80 + 30 + 'px',
                height: Math.random() * 80 + 30 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 6 + 's',
                animationDuration: Math.random() * 4 + 4 + 's',
                background: `linear-gradient(135deg, 
                  rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3),
                  rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.1)
                )`,
                boxShadow: `0 0 ${Math.random() * 50 + 20}px rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`
              }}
            ></div>
          ))}
        </div>
        
        <div className="relative z-10 text-center text-white px-4 animate-fade-in">
          <div className="mb-6 inline-block">
            <Heart className="w-24 h-24 animate-bounce" />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-slide-up">
            MediCare Plus Hospital
          </h1>
          <p className="text-2xl md:text-3xl mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Advanced Healthcare Management System
          </p>
          <button 
            onClick={(e) => {
              createRipple(e);
              setCurrentPage('appointments');
            }}
            className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-8 py-4 rounded-full text-xl font-semibold hover:scale-110 transform transition duration-300 shadow-2xl animate-slide-up group animate-pulse-glow"
            style={{ animationDelay: '0.4s' }}
          >
            <span className="relative z-10 flex items-center">
              Book Appointment <ChevronRight className="inline ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
            {ripples.map(ripple => (
              <span
                key={ripple.id}
                className="absolute rounded-full bg-purple-200 opacity-50 animate-ripple"
                style={{
                  left: ripple.x + 'px',
                  top: ripple.y + 'px',
                  width: ripple.size + 'px',
                  height: ripple.size + 'px',
                }}
              />
            ))}
          </button>
        </div>
      </div>

      <div className="py-20 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float"
              style={{
                width: Math.random() * 60 + 20 + 'px',
                height: Math.random() * 60 + 20 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5 + 's',
                background: `radial-gradient(circle, rgba(255,255,255,0.3), transparent)`
              }}
            ></div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div 
              className="text-center transform hover:scale-110 transition-all duration-300 cursor-pointer group bg-white bg-opacity-5 rounded-2xl p-6 hover:bg-opacity-10"
              onMouseEnter={() => setHoveredCard('stat-patients')}
            >
              <Users className={`w-12 h-12 mx-auto mb-4 text-blue-400 transition-transform duration-300 ${hoveredCard === 'stat-patients' ? 'scale-125 rotate-12' : ''}`} />
              <div className="text-5xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{stats.patients.toLocaleString()}</div>
              <div className="text-gray-400 group-hover:text-white transition-colors">Patients Treated</div>
            </div>
            <div 
              className="text-center transform hover:scale-110 transition-all duration-300 cursor-pointer group bg-white bg-opacity-5 rounded-2xl p-6 hover:bg-opacity-10"
              onMouseEnter={() => setHoveredCard('stat-doctors')}
            >
              <Stethoscope className={`w-12 h-12 mx-auto mb-4 text-green-400 transition-transform duration-300 ${hoveredCard === 'stat-doctors' ? 'scale-125 rotate-12' : ''}`} />
              <div className="text-5xl font-bold mb-2 group-hover:text-green-400 transition-colors">{stats.doctors}</div>
              <div className="text-gray-400 group-hover:text-white transition-colors">Expert Doctors</div>
            </div>
            <div 
              className="text-center transform hover:scale-110 transition-all duration-300 cursor-pointer group bg-white bg-opacity-5 rounded-2xl p-6 hover:bg-opacity-10"
              onMouseEnter={() => setHoveredCard('stat-staff')}
            >
              <Activity className={`w-12 h-12 mx-auto mb-4 text-purple-400 transition-transform duration-300 ${hoveredCard === 'stat-staff' ? 'scale-125 rotate-12' : ''}`} />
              <div className="text-5xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{stats.staff}</div>
              <div className="text-gray-400 group-hover:text-white transition-colors">Staff Members</div>
            </div>
            <div 
              className="text-center transform hover:scale-110 transition-all duration-300 cursor-pointer group bg-white bg-opacity-5 rounded-2xl p-6 hover:bg-opacity-10"
              onMouseEnter={() => setHoveredCard('stat-depts' )}
            >
              <Award className={`w-12 h-12 mx-auto mb-4 text-yellow-400 transition-transform duration-300 ${hoveredCard === 'stat-depts' ? 'scale-125 rotate-12' : ''}`} />
              <div className="text-5xl font-bold mb-2 group-hover:text-yellow-400 transition-colors">{stats.departments}</div>
              <div className="text-gray-400 group-hover:text-white transition-colors">Departments</div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float"
              style={{
                width: Math.random() * 100 + 50 + 'px',
                height: Math.random() * 100 + 50 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 4 + 's',
                background: `linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(219, 39, 119, 0.2))`
              }}
            ></div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 text-gray-800">Our Departments</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {departments.map((dept, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => setSelectedDept(dept)}
                className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer group relative border-2 border-transparent hover:border-purple-300"
              >
                <div className={`h-48 bg-gradient-to-br ${dept.color} flex items-center justify-center relative overflow-hidden`}>
                  <dept.icon className={`w-24 h-24 text-white transition-transform duration-300 ${hoveredCard === idx ? 'scale-125 rotate-12' : ''}`} />
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-600 transition-colors">{dept.name}</h3>
                  <p className="text-gray-600 mb-2">{dept.patients} patients this month</p>
                  {expandedDept === idx && (
                    <div className="mt-4 p-4 bg-purple-50 rounded-lg animate-slide-up">
                      <p className="text-sm text-gray-700 mb-2">{dept.description}</p>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{dept.doctors} doctors</span>
                      </div>
                    </div>
                  )}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedDept(expandedDept === idx ? null : idx);
                    }}
                    className="mt-4 text-purple-600 font-semibold hover:text-purple-800 flex items-center group/btn"
                  >
                    {expandedDept === idx ? 'Show Less' : 'Learn More'} 
                    <ChevronRight className={`inline w-4 h-4 ml-1 transition-transform ${expandedDept === idx ? 'rotate-90' : 'group-hover/btn:translate-x-1'}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-20 bg-gradient-to-br from-violet-600 via-purple-600 via-pink-600 to-rose-500 text-white relative overflow-hidden animate-gradient">
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float"
              style={{
                width: Math.random() * 80 + 40 + 'px',
                height: Math.random() * 80 + 40 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 6 + 's',
                background: `radial-gradient(circle, rgba(255,255,255,0.4), transparent)`
              }}
            ></div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 animate-slide-up">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div 
              className="text-center p-8 bg-white bg-opacity-10 rounded-2xl backdrop-blur-lg transform hover:scale-110 hover:bg-opacity-20 transition-all duration-300 cursor-pointer group"
              onMouseEnter={() => setHoveredCard('why-1')}
            >
              <Shield className={`w-16 h-16 mx-auto mb-4 transition-transform duration-300 ${hoveredCard === 'why-1' ? 'scale-125 rotate-12' : ''}`} />
              <h3 className="text-2xl font-bold mb-4 group-hover:text-yellow-300 transition-colors">24/7 Emergency Care</h3>
              <p className="group-hover:text-white transition-colors">Round-the-clock emergency services with expert medical staff</p>
            </div>
            <div 
              className="text-center p-8 bg-white bg-opacity-10 rounded-2xl backdrop-blur-lg transform hover:scale-110 hover:bg-opacity-20 transition-all duration-300 cursor-pointer group"
              onMouseEnter={() => setHoveredCard('why-2')}
            >
              <Award className={`w-16 h-16 mx-auto mb-4 transition-transform duration-300 ${hoveredCard === 'why-2' ? 'scale-125 rotate-12' : ''}`} />
              <h3 className="text-2xl font-bold mb-4 group-hover:text-yellow-300 transition-colors">Award-Winning Care</h3>
              <p className="group-hover:text-white transition-colors">Recognized for excellence in patient care and medical innovation</p>
            </div>
            <div 
              className="text-center p-8 bg-white bg-opacity-10 rounded-2xl backdrop-blur-lg transform hover:scale-110 hover:bg-opacity-20 transition-all duration-300 cursor-pointer group"
              onMouseEnter={() => setHoveredCard('why-3')}
            >
              <Activity className={`w-16 h-16 mx-auto mb-4 transition-transform duration-300 ${hoveredCard === 'why-3' ? 'scale-125 rotate-12' : ''}`} />
              <h3 className="text-2xl font-bold mb-4 group-hover:text-yellow-300 transition-colors">Advanced Technology</h3>
              <p className="group-hover:text-white transition-colors">State-of-the-art medical equipment and treatment facilities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDoctors = () => (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 via-pink-50 to-rose-50 py-20 relative overflow-hidden" ref={pageRef}>
      <div className="absolute inset-0 opacity-10">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: Math.random() * 120 + 60 + 'px',
              height: Math.random() * 120 + 60 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              background: `linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3), rgba(219, 39, 119, 0.3))`
            }}
          ></div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-16 text-gray-800 animate-slide-up">Our Expert Doctors</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doctor, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredCard(`doctor-${idx}`)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => setSelectedDoctor(doctor)}
              className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl shadow-xl overflow-hidden transform hover:scale-110 hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-purple-300"
            >
              <div className="h-48 bg-gradient-to-br from-cyan-400 via-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-8xl relative overflow-hidden animate-gradient">
                <div className={`absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                <div className={`transform transition-transform duration-300 ${hoveredCard === `doctor-${idx}` ? 'scale-110 rotate-6' : ''}`}>
                  {doctor.image}
                </div>
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full p-2 shadow-lg">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors">{doctor.name}</h3>
                <p className="text-purple-600 font-semibold mb-2">{doctor.specialty}</p>
                <p className="text-gray-600 text-sm mb-3">Experience: {doctor.experience}</p>
                <div className="flex items-center mb-4">
                  <Star className="w-5 h-5 text-yellow-400 fill-current animate-pulse" />
                  <span className="ml-2 font-bold">{doctor.rating}</span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    createRipple(e);
                    setCurrentPage('appointments');
                  }}
                  className="relative overflow-hidden w-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white py-2 rounded-lg hover:shadow-lg transition duration-300 group/btn animate-pulse-glow"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Book Appointment <ChevronRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                  {ripples.map(ripple => (
                    <span
                      key={ripple.id}
                      className="absolute rounded-full bg-white opacity-30 animate-ripple"
                      style={{
                        left: ripple.x + 'px',
                        top: ripple.y + 'px',
                        width: ripple.size + 'px',
                        height: ripple.size + 'px',
                      }}
                    />
                  ))}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-20" ref={pageRef}>
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-16 text-gray-800 animate-slide-up">Appointment Management</h1>
        
        {showSuccess && (
          <div className="mb-8 bg-green-500 text-white p-4 rounded-lg flex items-center justify-center animate-slide-up shadow-lg">
            <CheckCircle className="w-6 h-6 mr-2 animate-bounce" />
            <span className="font-semibold">Appointment booked successfully!</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-white via-purple-50 to-pink-50 rounded-2xl shadow-xl p-8 transform hover:shadow-2xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300">
            <h2 className="text-2xl font-bold mb-6 text-purple-600 flex items-center">
              <Calendar className="w-6 h-6 mr-2" />
              Book New Appointment
            </h2>
            <div className="space-y-4">
              <div>
                <input 
                  type="text" 
                  placeholder="Patient Name" 
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full p-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none transition-all bg-gradient-to-r from-white to-purple-50 ${
                    formErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-purple-200 hover:border-purple-400'
                  }`} 
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center animate-slide-up">
                    <XCircle className="w-4 h-4 mr-1" />
                    {formErrors.name}
                  </p>
                )}
              </div>
              <div>
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full p-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none transition-all bg-gradient-to-r from-white to-pink-50 ${
                    formErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-pink-200 hover:border-pink-400'
                  }`} 
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center animate-slide-up">
                    <XCircle className="w-4 h-4 mr-1" />
                    {formErrors.email}
                  </p>
                )}
              </div>
              <div>
                <select 
                  value={formData.dept}
                  onChange={(e) => handleInputChange('dept', e.target.value)}
                  className={`w-full p-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none transition-all bg-gradient-to-r from-purple-50 to-pink-50 ${
                    formErrors.dept ? 'border-red-500 focus:ring-red-500' : 'border-purple-300 hover:border-purple-500'
                  }`}
                >
                  <option value="">Select Department</option>
                  {departments.map((d, i) => <option key={i} value={d.name}>{d.name}</option>)}
                </select>
                {formErrors.dept && (
                  <p className="text-red-500 text-sm mt-1 flex items-center animate-slide-up">
                    <XCircle className="w-4 h-4 mr-1" />
                    {formErrors.dept}
                  </p>
                )}
              </div>
              
              {showDoctorSelection && (
                <div className="animate-bounce-in">
                  <label className="block text-sm font-semibold text-purple-700 mb-2 flex items-center">
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Select Doctor
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-2 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-xl border-2 border-purple-200">
                    {filteredDoctors.map((doctor, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          handleInputChange('doctor', doctor.name);
                          setSelectedDoctor(doctor);
                        }}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                          formData.doctor === doctor.name
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg animate-pulse-glow'
                            : 'bg-white hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 border-2 border-purple-200 hover:border-purple-400'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl">{doctor.image}</div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm">{doctor.name}</div>
                            <div className={`text-xs ${formData.doctor === doctor.name ? 'text-purple-100' : 'text-purple-600'}`}>
                              {doctor.specialty}
                            </div>
                            <div className="flex items-center mt-1">
                              <Star className={`w-3 h-3 ${formData.doctor === doctor.name ? 'text-yellow-300' : 'text-yellow-400'} fill-current`} />
                              <span className={`text-xs ml-1 ${formData.doctor === doctor.name ? 'text-white' : 'text-gray-600'}`}>
                                {doctor.rating} • {doctor.experience}
                              </span>
                            </div>
                          </div>
                          {formData.doctor === doctor.name && (
                            <CheckCircle className="w-5 h-5 text-white animate-bounce" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {formErrors.doctor && (
                    <p className="text-red-500 text-sm mt-1 flex items-center animate-slide-up">
                      <XCircle className="w-4 h-4 mr-1" />
                      {formErrors.doctor}
                    </p>
                  )}
                </div>
              )}
              
              <div>
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className={`w-full p-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none transition-all bg-gradient-to-r from-white to-blue-50 ${
                    formErrors.date ? 'border-red-500 focus:ring-red-500' : 'border-blue-200 hover:border-blue-400'
                  }`} 
                />
                {formErrors.date && (
                  <p className="text-red-500 text-sm mt-1 flex items-center animate-slide-up">
                    <XCircle className="w-4 h-4 mr-1" />
                    {formErrors.date}
                  </p>
                )}
              </div>
              <div>
                <input 
                  type="time" 
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className={`w-full p-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none transition-all bg-gradient-to-r from-white to-indigo-50 ${
                    formErrors.time ? 'border-red-500 focus:ring-red-500' : 'border-indigo-200 hover:border-indigo-400'
                  }`} 
                />
                {formErrors.time && (
                  <p className="text-red-500 text-sm mt-1 flex items-center animate-slide-up">
                    <XCircle className="w-4 h-4 mr-1" />
                    {formErrors.time}
                  </p>
                )}
              </div>
              <button 
                onClick={handleBookAppointment}
                className="relative overflow-hidden w-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition duration-300 group animate-pulse-glow"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Book Appointment <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                {ripples.map(ripple => (
                  <span
                    key={ripple.id}
                    className="absolute rounded-full bg-white opacity-30 animate-ripple"
                    style={{
                      left: ripple.x + 'px',
                      top: ripple.y + 'px',
                      width: ripple.size + 'px',
                      height: ripple.size + 'px',
                    }}
                  />
                ))}
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">Quick Stats</h2>
            <div className="space-y-6">
              <div className="flex items-center">
                <Calendar className="w-12 h-12 mr-4" />
                <div>
                  <div className="text-3xl font-bold">127</div>
                  <div className="text-purple-200">Today's Appointments</div>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="w-12 h-12 mr-4" />
                <div>
                  <div className="text-3xl font-bold">15 min</div>
                  <div className="text-purple-200">Average Wait Time</div>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="w-12 h-12 mr-4" />
                <div>
                  <div className="text-3xl font-bold">98%</div>
                  <div className="text-purple-200">Patient Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
            <Clock className="w-6 h-6 mr-2 text-purple-600" />
            Today's Appointments
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                  <th className="text-left p-4 font-semibold text-purple-600">ID</th>
                  <th className="text-left p-4 font-semibold text-purple-600">Patient</th>
                  <th className="text-left p-4 font-semibold text-purple-600">Doctor</th>
                  <th className="text-left p-4 font-semibold text-purple-600">Time</th>
                  <th className="text-left p-4 font-semibold text-purple-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt, idx) => (
                  <tr 
                    key={idx} 
                    className="border-b hover:bg-purple-50 transition-all duration-200 cursor-pointer transform hover:scale-[1.01] group"
                  >
                    <td className="p-4 font-mono group-hover:text-purple-600 transition-colors">{apt.id}</td>
                    <td className="p-4 group-hover:font-semibold transition-all">{apt.patient}</td>
                    <td className="p-4 group-hover:text-purple-600 transition-colors">{apt.doctor}</td>
                    <td className="p-4 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-400 group-hover:text-purple-600 transition-colors" />
                      {apt.time}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold transition-all transform group-hover:scale-110 ${
                        apt.status === 'Confirmed' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                        apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                        'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-20" ref={pageRef}>
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-16 text-gray-800 animate-slide-up">Contact Us</h1>
        
        {contactSuccess && (
          <div className="mb-8 bg-green-500 text-white p-4 rounded-lg flex items-center justify-center animate-slide-up shadow-lg">
            <CheckCircle className="w-6 h-6 mr-2 animate-bounce" />
            <span className="font-semibold">Message sent successfully!</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:shadow-2xl transition-all duration-300">
            <h2 className="text-2xl font-bold mb-6 text-purple-600 flex items-center">
              <Mail className="w-6 h-6 mr-2" />
              Get In Touch
            </h2>
            <div className="space-y-6">
              <div className="flex items-start group cursor-pointer hover:bg-purple-50 p-3 rounded-lg transition-all">
                <MapPin className="w-6 h-6 text-purple-600 mr-4 mt-1 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-semibold text-lg group-hover:text-purple-600 transition-colors">Address</div>
                  <div className="text-gray-600">123 Healthcare Avenue, Medical District, New York, NY 10001</div>
                </div>
              </div>
              <div className="flex items-start group cursor-pointer hover:bg-purple-50 p-3 rounded-lg transition-all">
                <Phone className="w-6 h-6 text-purple-600 mr-4 mt-1 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-semibold text-lg group-hover:text-purple-600 transition-colors">Phone</div>
                  <div className="text-gray-600 hover:text-purple-600 transition-colors">+1 (555) 123-4567</div>
                  <div className="text-gray-600 hover:text-purple-600 transition-colors">Emergency: +1 (555) 911-0000</div>
                </div>
              </div>
              <div className="flex items-start group cursor-pointer hover:bg-purple-50 p-3 rounded-lg transition-all">
                <Mail className="w-6 h-6 text-purple-600 mr-4 mt-1 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-semibold text-lg group-hover:text-purple-600 transition-colors">Email</div>
                  <div className="text-gray-600 hover:text-purple-600 transition-colors">info@medicareplus.com</div>
                  <div className="text-gray-600 hover:text-purple-600 transition-colors">emergency@medicareplus.com</div>
                </div>
              </div>
              <div className="flex items-start group cursor-pointer hover:bg-purple-50 p-3 rounded-lg transition-all">
                <Clock className="w-6 h-6 text-purple-600 mr-4 mt-1 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-semibold text-lg group-hover:text-purple-600 transition-colors">Working Hours</div>
                  <div className="text-gray-600">24/7 Emergency Services</div>
                  <div className="text-gray-600">OPD: 8:00 AM - 8:00 PM</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-xl p-8 text-white transform hover:shadow-2xl transition-all duration-300">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Mail className="w-6 h-6 mr-2" />
              Send us a Message
            </h2>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Your Name" 
                value={contactForm.name}
                onChange={(e) => handleContactChange('name', e.target.value)}
                className="w-full p-3 rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-white transition-all" 
              />
              <input 
                type="email" 
                placeholder="Your Email" 
                value={contactForm.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
                className="w-full p-3 rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-white transition-all" 
              />
              <input 
                type="text" 
                placeholder="Subject" 
                value={contactForm.subject}
                onChange={(e) => handleContactChange('subject', e.target.value)}
                className="w-full p-3 rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-white transition-all" 
              />
              <textarea 
                placeholder="Your Message" 
                rows={5} 
                value={contactForm.message}
                onChange={(e) => handleContactChange('message', e.target.value)}
                className="w-full p-3 rounded-lg text-gray-800 outline-none resize-none focus:ring-2 focus:ring-white transition-all"
              ></textarea>
              <button 
                onClick={handleContactSubmit}
                className="relative overflow-hidden w-full bg-white text-purple-600 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition duration-300 group"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Send Message <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                {ripples.map(ripple => (
                  <span
                    key={ripple.id}
                    className="absolute rounded-full bg-purple-200 opacity-50 animate-ripple"
                    style={{
                      left: ripple.x + 'px',
                      top: ripple.y + 'px',
                      width: ripple.size + 'px',
                      height: ripple.size + 'px',
                    }}
                  />
                ))}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes ripple {
          from {
            transform: scale(0);
            opacity: 1;
          }
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.5); }
          50% { box-shadow: 0 0 40px rgba(147, 51, 234, 0.8), 0 0 60px rgba(219, 39, 119, 0.5); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-ripple {
          animation: ripple 0.6s ease-out;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
      `}</style>

      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Heart className={`w-10 h-10 mr-3 ${scrolled ? 'text-purple-600' : 'text-white'}`} />
              <span className={`text-2xl font-bold ${scrolled ? 'text-gray-800' : 'text-white'}`}>MediCare Plus</span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              {['home', 'doctors', 'appointments', 'contact'].map(page => (
                <button
                  key={page}
                  onClick={(e) => {
                    createRipple(e);
                    setCurrentPage(page);
                  }}
                  className={`relative text-lg font-semibold capitalize transition-all duration-300 transform hover:scale-110 ${
                    scrolled ? 'text-gray-700 hover:text-purple-600' : 'text-white hover:text-purple-200'
                  } ${currentPage === page ? 'border-b-2 border-purple-600' : ''}`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className={scrolled ? 'text-gray-800' : 'text-white'} /> : <Menu className={scrolled ? 'text-gray-800' : 'text-white'} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white shadow-lg animate-slide-up">
            {['home', 'doctors', 'appointments', 'contact'].map(page => (
              <button
                key={page}
                onClick={(e) => { 
                  createRipple(e);
                  setCurrentPage(page); 
                  setMenuOpen(false); 
                }}
                className="relative overflow-hidden block w-full text-left px-4 py-3 text-gray-700 hover:bg-purple-50 capitalize font-semibold transition-all transform hover:translate-x-2"
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </nav>

      {currentPage === 'home' && renderHome()}
      {currentPage === 'doctors' && renderDoctors()}
      {currentPage === 'appointments' && renderAppointments()}
      {currentPage === 'contact' && renderContact()}

      {/* Department Modal */}
      {selectedDept && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setSelectedDept(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 transform hover:scale-105 transition-transform animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`h-20 w-20 bg-gradient-to-br ${selectedDept.color} rounded-xl flex items-center justify-center`}>
                <selectedDept.icon className="w-12 h-12 text-white" />
              </div>
              <button 
                onClick={() => setSelectedDept(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">{selectedDept.name}</h2>
            <p className="text-gray-600 mb-6 text-lg">{selectedDept.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{selectedDept.patients}</div>
                <div className="text-gray-600">Patients This Month</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{selectedDept.doctors}</div>
                <div className="text-gray-600">Expert Doctors</div>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-purple-600" />
                Equipment & Facilities
              </h3>
              <p className="text-gray-600">{selectedDept.equipment}</p>
            </div>
            <button 
              onClick={(e) => {
                createRipple(e);
                setSelectedDept(null);
                setCurrentPage('appointments');
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition duration-300 relative overflow-hidden"
            >
              <span className="relative z-10">Book Appointment</span>
              {ripples.map(ripple => (
                <span
                  key={ripple.id}
                  className="absolute rounded-full bg-white opacity-30 animate-ripple"
                  style={{
                    left: ripple.x + 'px',
                    top: ripple.y + 'px',
                    width: ripple.size + 'px',
                    height: ripple.size + 'px',
                  }}
                />
              ))}
            </button>
          </div>
        </div>
      )}

      {/* Doctor Modal */}
      {selectedDoctor && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setSelectedDoctor(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform hover:scale-105 transition-transform animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="h-24 w-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-6xl">
                {selectedDoctor.image}
              </div>
              <button 
                onClick={() => setSelectedDoctor(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <h2 className="text-3xl font-bold mb-2 text-gray-800">{selectedDoctor.name}</h2>
            <p className="text-purple-600 font-semibold mb-4 text-lg">{selectedDoctor.specialty}</p>
            <div className="flex items-center mb-4">
              <Star className="w-6 h-6 text-yellow-400 fill-current" />
              <span className="ml-2 font-bold text-xl">{selectedDoctor.rating}</span>
              <span className="ml-2 text-gray-600">Rating</span>
            </div>
            <div className="mb-6">
              <div className="flex items-center text-gray-600 mb-2">
                <Clock className="w-5 h-5 mr-2" />
                <span>Experience: {selectedDoctor.experience}</span>
              </div>
            </div>
            <button 
              onClick={(e) => {
                createRipple(e);
                setSelectedDoctor(null);
                setCurrentPage('appointments');
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition duration-300 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center">
                Book Appointment <ChevronRight className="ml-2 w-5 h-5" />
              </span>
              {ripples.map(ripple => (
                <span
                  key={ripple.id}
                  className="absolute rounded-full bg-white opacity-30 animate-ripple"
                  style={{
                    left: ripple.x + 'px',
                    top: ripple.y + 'px',
                    width: ripple.size + 'px',
                    height: ripple.size + 'px',
                  }}
                />
              ))}
            </button>
          </div>
        </div>
      )}

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Heart className="w-8 h-8 mr-2" />
                <span className="text-xl font-bold">MediCare Plus</span>
              </div>
              <p className="text-gray-400">Providing exceptional healthcare services with compassion and excellence.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <div className="text-gray-400 hover:text-white cursor-pointer transform hover:translate-x-2 transition-all duration-300">About Us</div>
                <div className="text-gray-400 hover:text-white cursor-pointer transform hover:translate-x-2 transition-all duration-300">Services</div>
                <div className="text-gray-400 hover:text-white cursor-pointer transform hover:translate-x-2 transition-all duration-300">Careers</div>
                <div className="text-gray-400 hover:text-white cursor-pointer transform hover:translate-x-2 transition-all duration-300">News</div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Services</h3>
              <div className="space-y-2">
                <div className="text-gray-400 hover:text-white cursor-pointer transform hover:translate-x-2 transition-all duration-300">Emergency Care</div>
                <div className="text-gray-400 hover:text-white cursor-pointer transform hover:translate-x-2 transition-all duration-300">Surgery</div>
                <div className="text-gray-400 hover:text-white cursor-pointer transform hover:translate-x-2 transition-all duration-300">Diagnostics</div>
                <div className="text-gray-400 hover:text-white cursor-pointer transform hover:translate-x-2 transition-all duration-300">Pharmacy</div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4">Subscribe for health tips and updates</p>
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full p-2 rounded bg-gray-800 text-white outline-none mb-2 focus:ring-2 focus:ring-purple-600 transition-all" 
              />
              <button 
                onClick={(e) => createRipple(e)}
                className="relative overflow-hidden w-full bg-purple-600 py-2 rounded hover:bg-purple-700 transition duration-300 transform hover:scale-105"
              >
                <span className="relative z-10">Subscribe</span>
                {ripples.map(ripple => (
                  <span
                    key={ripple.id}
                    className="absolute rounded-full bg-white opacity-30 animate-ripple"
                    style={{
                      left: ripple.x + 'px',
                      top: ripple.y + 'px',
                      width: ripple.size + 'px',
                      height: ripple.size + 'px',
                    }}
                  />
                ))}
              </button>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            © 2024 MediCare Plus Hospital. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HospitalManagementSystem;