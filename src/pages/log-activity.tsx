import { useState } from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


export default function LogActivity() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [formData, setFormData] = useState({  
        physicalActivity: false,
        reading: false,
        codingLearning: false,
        writingTweeting: false,
    });

    const handleDateChange: CalendarProps['onChange'] = (value, event) => {
        if (!value) {
          setSelectedDate(null);
          return;
        }
        if (value instanceof Date) {
          setSelectedDate(value);
        } else {
          setSelectedDate(value[0]); 
        }
      };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: checked, 
        }));
      };

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date: selectedDate, ...formData }),
        });

        if (response.ok) {
            setFormData({
              physicalActivity: false,
              reading: false,
              codingLearning: false,
              writingTweeting: false,
            });
          } else {
            alert('Failed to log activity.');
          }
        } catch (error) {
          console.error(error);
          alert('Something went wrong.');
        }
      };


      return (
        <div className="max-w-md mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Log Your Activities</h1>
    
          <div className="mb-4">
            <label className="block text-sm font-medium">Select a Date</label>
            <Calendar onChange={handleDateChange} value={selectedDate} />
          </div>
    
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium">
                Physical Activity (≥ 20 mins)
              </label>
              <input
                type="checkbox"
                name="physicalActivity"
                checked={formData.physicalActivity}
                onChange={handleChange}
              />
            </div>
    
            <div className="mb-4">
              <label className="block text-sm font-medium">Reading (≥ 10 mins)</label>
              <input
                type="checkbox"
                name="reading"
                checked={formData.reading}
                onChange={handleChange}
              />
            </div>
    
            <div className="mb-4">
              <label className="block text-sm font-medium">Coding/STEM Learning</label>
              <input
                type="checkbox"
                name="codingLearning"
                checked={formData.codingLearning}
                onChange={handleChange}
              />
            </div>
    
            <div className="mb-4">
              <label className="block text-sm font-medium">Writing/Tweeting</label>
              <input
                type="checkbox"
                name="writingTweeting"
                checked={formData.writingTweeting}
                onChange={handleChange}
              />
            </div>
    
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Log Activity
            </button>
          </form>
        </div>
      );
    }