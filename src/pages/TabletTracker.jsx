import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import PatientSidebar from "../components/PatientSidebar";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Dashboard = ({ medications = [], courses = [] }) => {
  const totalCourses = courses.length;
  const completedCourses = courses.filter((course) => {
    const endDate = new Date(course.endDate);
    return endDate <= new Date();
  }).length;
  const adherenceRate =
    totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

  // Generate actual adherence data based on courses
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const adherenceData = daysOfWeek.map((day) => {
    const dayIndex = daysOfWeek.indexOf(day);
    const today = new Date();
    const currentDay = today.getDay(); // 0 (Sun) to 6 (Sat)
    const targetDate = new Date(today);
    targetDate.setDate(
      today.getDate() - (currentDay - dayIndex) + (currentDay === 0 ? 1 : 0)
    );

    const formattedDate = targetDate.toISOString().split("T")[0];

    return {
      day,
      taken: courses.filter(
        (c) => c.startDate <= formattedDate && c.endDate >= formattedDate
      ).length,
    };
  });

  // Generate medication frequency distribution
  const pieData = medications.map((med) => {
    const medCourses = courses.filter((c) => c.medication === med._id);
    return {
      name: med.name,
      value: medCourses.length,
    };
  });

  const pieColors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7f50",
    "#00c49f",
    "#ffbb28",
    "#0088fe",
  ];

  return (
    <div className="dashboard">
      <h2 className="text-2xl font-bold mb-4">Medication Dashboard</h2>

      <div className="stats-cards flex gap-6 mb-8">
        <div className="stat-card bg-blue-100 p-4 rounded-lg flex-1 text-center">
          <h3 className="text-lg font-semibold">Active Medications</h3>
          <p className="stat-value text-3xl font-bold">{medications.length}</p>
        </div>
        <div className="stat-card bg-green-100 p-4 rounded-lg flex-1 text-center">
          <h3 className="text-lg font-semibold">Course Completion</h3>
          <p className="stat-value text-3xl font-bold">{adherenceRate}%</p>
        </div>
        <div className="stat-card bg-red-100 p-4 rounded-lg flex-1 text-center">
          <h3 className="text-lg font-semibold">Active Courses</h3>
          <p className="stat-value text-3xl font-bold">
            {courses.filter((c) => new Date(c.endDate) > new Date()).length}
          </p>
        </div>
      </div>

      <div
        className="charts"
        style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}
      >
        <div className="adherence-chart" style={{ flex: 1, minWidth: 300 }}>
          <h3 className="text-xl font-semibold mb-2">
            Weekly Medication Schedule
          </h3>
          <BarChart width={400} height={300} data={adherenceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="taken" fill="#8884d8" name="Active Medications" />
          </BarChart>
        </div>

        <div
          className="medication-distribution"
          style={{ flex: 1, minWidth: 300 }}
        >
          <h3 className="text-xl font-semibold mb-2">Medication Frequency</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={pieColors[index % pieColors.length]}
                />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

const Tracker = ({
  medications,
  courses,
  deleteMedication,
  newMedication,
  setNewMedication,
  addMedication,
  newCourse,
  setNewCourse,
  addCourse,
  deleteCourse,
}) => (
  <div className="tracker">
    <h2 className="text-2xl font-bold mb-4">Current Medications</h2>

    <div className="add-medication-form mb-6 p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Add New Medication</h3>
      <div className="flex flex-wrap gap-3">
        <input
          className="border p-2 rounded flex-grow min-w-[150px]"
          placeholder="Name"
          value={newMedication.name}
          onChange={(e) =>
            setNewMedication({ ...newMedication, name: e.target.value })
          }
        />
        <input
          className="border p-2 rounded flex-grow min-w-[150px]"
          placeholder="Dosage (mg)"
          value={newMedication.dosage}
          onChange={(e) =>
            setNewMedication({ ...newMedication, dosage: e.target.value })
          }
        />
        <select
          className="border p-2 rounded flex-grow min-w-[150px]"
          value={newMedication.frequency}
          onChange={(e) =>
            setNewMedication({ ...newMedication, frequency: e.target.value })
          }
        >
          <option value="">Select Frequency</option>
          <option value="Once daily">Once daily</option>
          <option value="Twice daily">Twice daily</option>
          <option value="Three times daily">Three times daily</option>
          <option value="Weekly">Weekly</option>
          <option value="As needed">As needed</option>
        </select>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={addMedication}
        >
          Add Medication
        </button>
      </div>
    </div>

    <div className="add-course-form mb-6 p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">
        Start New Medication Course
      </h3>
      <div className="flex flex-wrap gap-3">
        <select
          className="border p-2 rounded flex-grow min-w-[150px]"
          value={newCourse.medicationId}
          onChange={(e) =>
            setNewCourse({ ...newCourse, medicationId: e.target.value })
          }
        >
          <option value="">Select Medication</option>
          {medications.map((med) => (
            <option key={med._id} value={med._id}>
              {med.name} ({med.dosage}mg - {med.frequency})
            </option>
          ))}
        </select>
        <input
          type="date"
          className="border p-2 rounded flex-grow min-w-[150px]"
          value={newCourse.startDate}
          onChange={(e) =>
            setNewCourse({ ...newCourse, startDate: e.target.value })
          }
        />
        <input
          type="date"
          className="border p-2 rounded flex-grow min-w-[150px]"
          value={newCourse.endDate}
          onChange={(e) =>
            setNewCourse({ ...newCourse, endDate: e.target.value })
          }
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={addCourse}
        >
          Start Course
        </button>
      </div>
    </div>

    <div className="active-courses mb-6">
      <h3 className="text-xl font-semibold mb-3">Active Courses</h3>
      {courses.filter((course) => {
        const endDate = new Date(course.endDate);
        return endDate > new Date();
      }).length > 0 ? (
        courses
          .filter((course) => {
            const endDate = new Date(course.endDate);
            return endDate > new Date();
          })
          .map((course) => {
            const med = medications.find((m) => m._id === course.medication);
            return (
              <div
                key={course._id}
                className="course-card p-4 rounded-lg shadow bg-white mb-3"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">
                      {med ? med.name : "Unknown"} ({med ? med.dosage : "?"}mg)
                    </h4>
                    <p className="text-sm text-gray-600">
                      {med?.frequency} •{" "}
                      {new Date(course.startDate).toLocaleDateString()} -{" "}
                      {new Date(course.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => deleteCourse(course._id)}
                  >
                    End Course
                  </button>
                </div>
              </div>
            );
          })
      ) : (
        <p className="text-gray-500">No active medication courses.</p>
      )}
    </div>

    <div className="medication-list">
      <h3 className="text-xl font-semibold mb-4 border-t pt-2">
        Medication Inventory
      </h3>
      <div className="medication-cards flex flex-col gap-4">
        {medications.map((med) => (
          <div
            key={med._id}
            className="medication-card p-4 rounded-lg shadow bg-gray-50 flex flex-col sm:flex-row justify-between items-center"
          >
            <div className="medication-info flex-grow">
              <h3 className="text-lg font-semibold">{med.name}</h3>
              <p className="text-gray-600">
                <strong>Dosage:</strong> {med.dosage}mg
              </p>
              <p className="text-gray-600">
                <strong>Frequency:</strong> {med.frequency}
              </p>
            </div>
            <div className="buttons mt-3 sm:mt-0 flex gap-2 self-end sm:self-auto">
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                onClick={() => deleteMedication(med._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const History = ({ courses, medications, downloadPDF }) => {
  const sortedCourses = [...courses].sort(
    (a, b) => new Date(b.endDate) - new Date(a.endDate)
  );

  return (
    <div className="history">
      <h2 className="text-2xl font-bold mb-4">Medication Course History</h2>
      <button
        onClick={downloadPDF}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Download PDF
      </button>
      <div className="history-table-container overflow-auto max-h-96">
        <table className="history-table w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2 text-left">
                Medication
              </th>
              <th className="border border-gray-300 p-2 text-left">Dosage</th>
              <th className="border border-gray-300 p-2 text-left">
                Frequency
              </th>
              <th className="border border-gray-300 p-2 text-left">
                Start Date
              </th>
              <th className="border border-gray-300 p-2 text-left">End Date</th>
              <th className="border border-gray-300 p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedCourses.map((course) => {
              const med = medications.find((m) => m._id === course.medication);
              const endDate = new Date(course.endDate);
              const isCompleted = endDate <= new Date();

              return (
                <tr key={course._id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-2">
                    {med ? med.name : "Unknown"}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {med ? `${med.dosage}mg` : "?"}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {med ? med.frequency : "?"}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {new Date(course.startDate).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {endDate.toLocaleDateString()}
                  </td>
                  <td
                    className={`status-badge px-3 py-1 rounded ${
                      isCompleted
                        ? "bg-green-300 text-green-800"
                        : "bg-yellow-300 text-yellow-800"
                    }`}
                  >
                    {isCompleted ? "Completed" : "Active"}
                  </td>
                </tr>
              );
            })}
            {courses.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No medication course history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TabletTracker = () => {
  const { user } = useAuth();
  const [medications, setMedications] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    frequency: "",
  });
  const [newCourse, setNewCourse] = useState({
    medicationId: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medsRes, coursesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/medications", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get("http://localhost:5000/api/medications/courses", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);
        setMedications(medsRes.data);
        setCourses(coursesRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  const addMedication = async () => {
    if (
      !newMedication.name ||
      !newMedication.dosage ||
      !newMedication.frequency
    ) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/medications",
        newMedication,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMedications([...medications, res.data]);
      setNewMedication({ name: "", dosage: "", frequency: "" });
    } catch (err) {
      alert(
        "Failed to add medication: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const deleteMedication = async (medId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this medication? This will also delete related courses."
      )
    ) {
      try {
        await axios.delete(`http://localhost:5000/api/medications/${medId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setMedications(medications.filter((med) => med._id !== medId));
        setCourses(courses.filter((course) => course.medication !== medId));
      } catch (err) {
        alert(
          "Failed to delete medication: " +
            (err.response?.data?.message || err.message)
        );
      }
    }
  };

  const addCourse = async () => {
    if (!newCourse.medicationId || !newCourse.startDate || !newCourse.endDate) {
      alert("Please fill in all fields.");
      return;
    }
    const startDate = new Date(newCourse.startDate);
    const endDate = new Date(newCourse.endDate);
    if (endDate <= startDate) {
      alert("End date must be after start date.");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/medications/courses",
        {
          medication: newCourse.medicationId,
          startDate: newCourse.startDate,
          endDate: newCourse.endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCourses([...courses, res.data]);
      setNewCourse({ medicationId: "", startDate: "", endDate: "" });
    } catch (err) {
      alert(
        "Failed to add course: " + (err.response?.data?.message || err.message)
      );
    }
  };

  const deleteCourse = async (courseId) => {
    if (
      window.confirm("Are you sure you want to delete this medication course?")
    ) {
      try {
        await axios.delete(
          `http://localhost:5000/api/medications/courses/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCourses(courses.filter((course) => course._id !== courseId));
      } catch (err) {
        alert(
          "Failed to delete course: " +
            (err.response?.data?.message || err.message)
        );
      }
    }
  };

  const endCourse = async (courseId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/medications/courses/${courseId}/end`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCourses(
        courses.map((course) =>
          course._id === courseId ? res.data : course
        )
      );
    } catch (err) {
      alert(
        "Failed to end course: " + (err.response?.data?.message || err.message)
      );
    }
  };
  
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Medication Course History", 14, 16);

    doc.autoTable({
      startY: 20,
      head: [
        [
          "Medication",
          "Dosage",
          "Frequency",
          "Start Date",
          "End Date",
          "Status",
        ],
      ],
      body: courses.map((course) => {
        const med = medications.find((m) => m._id === course.medication);
        const endDate = new Date(course.endDate);
        const isCompleted = endDate <= new Date();

        return [
          med ? med.name : "Unknown",
          med ? `${med.dosage}mg` : "?",
          med ? med.frequency : "?",
          new Date(course.startDate).toLocaleDateString(),
          endDate.toLocaleDateString(),
          isCompleted ? "Completed" : "Active",
        ];
      }),
    });

    doc.save("medication_courses.pdf");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <PatientSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="hidden md:block">
        <PatientSidebar />
      </div>
      <main
        className="flex-1 ml-0 md:ml-64 p-4 md:p-8 bg-gray-50 min-h-screen overflow-y-auto"
      >
        <h1 className="text-4xl font-bold mb-8">Medication Tracker</h1>
        <Dashboard medications={medications} courses={courses} />
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Tracker
              medications={medications}
              courses={courses}
              deleteMedication={deleteMedication}
              newMedication={newMedication}
              setNewMedication={setNewMedication}
              addMedication={addMedication}
              newCourse={newCourse}
              setNewCourse={setNewCourse}
              addCourse={addCourse}
              deleteCourse={endCourse}
            />
          </div>
          <div>
            <History
              courses={courses}
              medications={medications}
              downloadPDF={downloadPDF}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TabletTracker;