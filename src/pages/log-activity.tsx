import { useState } from 'react';

export default function LogActivity() {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [formData, setFormData] = useState({  
        physicalActivity: false,
        reading: false,
        codingLearning: false,
        writingTweeting: false,
        protein: false,
    });

    const activities = [
        {
            name: 'Physical Activity',
            key: 'physicalActivity',
            description: '≥ 20 mins',
        },
        {
            name: 'Reading',
            key: 'reading',
            description: '≥ 10 mins',
        },
        {
            name: 'Coding/Learning',
            key: 'codingLearning',
            description: '',
        },
        {
            name: 'Writing/Tweeting',
            key: 'writingTweeting',
            description: '',
        },
        {
            name: 'Protein',
            key: 'protein',
            description: '≥ 150g',
        }
    ];

    const fetchExistingData = async (date: string) => {
        try {
            console.log('Fetching data for date:', date);
            const response = await fetch(`/api/logs/${date}`);
            console.log('Response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched data:', data);
                
                if (data) {
                    setFormData({
                        physicalActivity: data.physicalActivity || false,
                        reading: data.reading || false,
                        codingLearning: data.codingLearning || false,
                        writingTweeting: data.writingTweeting || false,
                        protein: data.protein || false,
                    });
                } else {
                    console.log('No data found for date, resetting form');
                    setFormData({
                        physicalActivity: false,
                        reading: false,
                        codingLearning: false,
                        writingTweeting: false,
                        protein: false,
                    });
                }
            } else {
                console.log('Response not OK:', await response.text());
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        fetchExistingData(newDate);
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
        
        const selectedDateTime = new Date(selectedDate);
        const adjustedDate = new Date(
            selectedDateTime.getTime() + 
            selectedDateTime.getTimezoneOffset() * 60000
        );

        const submitData = { 
            date: adjustedDate,
            ...formData 
        };
        console.log('Submitting data:', JSON.stringify(submitData, null, 2));

        try {
            const response = await fetch('/api/logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
            });

            if (response.ok) {
                await fetchExistingData(selectedDate);
                alert('Activity logged successfully.');
              } else {
                alert('Failed to log activity.');
              }
        } catch (error) {
          console.error(error);
          alert('Something went wrong.');
        }
      };


      return (
        <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-2xl mx-auto">
                <div className="border-b pb-6 mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Daily Check-in</h1>
                    <p className="text-gray-500 mt-1">Track your daily activities</p>
                </div>

                <div className="bg-gray-50 p-6 mb-8 rounded-[10px]">
                    <h2 className="text-sm font-medium text-gray-600 mb-2">Select Date</h2>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="w-full bg-white border-gray-200 text-gray-900 text-lg"
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {activities.map((activity) => (
                        <div 
                            key={activity.key}
                            className={`
                                bg-gray-50 p-6 transition-colors duration-150 rounded-[10px]
                                ${formData[activity.key as keyof typeof formData] 
                                    ? 'bg-blue-50' 
                                    : 'hover:bg-gray-100'
                                }
                            `}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-medium text-gray-900">
                                        {activity.name}
                                    </h3>
                                    {activity.description && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            {activity.description}
                                        </p>
                                    )}
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name={activity.key}
                                        checked={formData[activity.key as keyof typeof formData]}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 
                                                  peer-focus:outline-none peer-focus:ring-2 
                                                  peer-focus:ring-blue-300 rounded-full peer 
                                                  peer-checked:after:translate-x-full peer-checked:after:border-white 
                                                  after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                                  after:bg-white after:border-gray-300 after:border after:rounded-full 
                                                  after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                                    </div>
                                </label>
                            </div>
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="w-full bg-blue-900 text-white mt-8 py-4 px-6 font-medium 
                                 hover:bg-blue-800 transition-colors duration-150 rounded-[10px]"
                    >
                        Save Daily Progress
                    </button>
                </form>
            </div>
        </div>
    );
}