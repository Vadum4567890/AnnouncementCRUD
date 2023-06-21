import "./App.css";

import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
	const [announcements, setAnnouncements] = useState([]);
	const [editMode, setEditMode] = useState(false);
	const [selectedAnnouncementId, setSelectedAnnouncementId] = useState(null);
	useEffect(() => {
		fetchAnnouncements();
	}, []);

	const fetchAnnouncements = async () => {
		try {
			const response = await axios.get(
				"https://localhost:7062/api/Announcement/Announcements"
			);
			setAnnouncements(response.data);
		} catch (error) {
			console.error("Error fetching announcements:", error);
		}
	};

	const handleDelete = (id) => {
		fetch(`https://localhost:7062/api/Announcement/${id}`, {
			method: "DELETE",
		})
			.then((response) => {
				if (response.ok) {
					setAnnouncements(
						announcements.filter((item) => item.id !== id)
					);
				} else {
					console.error(
						"Error deleting announcement. Status:",
						response.status
					);
				}
			})
			.catch((error) => {
				console.error("Error deleting announcement:", error);
			});
	};

	const [newAnnouncement, setNewAnnouncement] = useState({
		title: "",
		description: "",
		dateCreated: "",
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewAnnouncement((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleEdit = (id) => {
		const selectedAnnouncement = announcements.find(
			(item) => item.id === id
		);
		setEditMode(true);
		setSelectedAnnouncementId(id);
		setNewAnnouncement({
			...selectedAnnouncement,
			dateCreated: selectedAnnouncement.dateCreated,
		});
	};

	const handleSave = async () => {
		try {
			const response = await axios.put(
				`https://localhost:7062/api/Announcement/${selectedAnnouncementId}`,
				newAnnouncement
			);
			const updatedAnnouncement = response.data;

			setAnnouncements((announcements) =>
				announcements.map((item) =>
					item.id === selectedAnnouncementId
						? updatedAnnouncement
						: item
				)
			);
			setNewAnnouncement({
				title: updatedAnnouncement.title,
				description: updatedAnnouncement.description,
				dateCreated: updatedAnnouncement.dateCreated,
			});
			setEditMode(false);
			setSelectedAnnouncementId(null);
			window.location.reload();
		} catch (error) {
			console.error("Error updating announcement:", error);
		}
	};

	const handleCancel = () => {
		setEditMode(false);
		setSelectedAnnouncementId(null);
		setNewAnnouncement({ title: "", description: "", dateCreated: "" });
	};

	const handleCreateAnnouncement = async (e) => {
		e.preventDefault();

		try {
			// Make a POST request to the API to create a new announcement
			const response = await axios.post(
				"https://localhost:7062/api/Announcement",
				newAnnouncement,
				{ headers: { "Content-Type": "application/json" } } // Add the headers option
			);
			const createdAnnouncement = response.data;

			// Update the announcements state with the newly created announcement
			setAnnouncements([...announcements, createdAnnouncement]);

			// Clear the form inputs
			setNewAnnouncement({ title: "", description: "", dateCreated: "" });
		} catch (error) {
			console.error("Error creating announcement:", error);
		}
	};

	const handleShowDetails = (id) => {
		setSelectedAnnouncementId((prevId) => (prevId === id ? null : id));
	};

	return (
		<>
			<h1>Announcements</h1>
			{editMode ? (
				<>
					<form>
						<div>
							<label htmlFor="title">Title:</label>
							<input
								type="text"
								id="title"
								name="title"
								value={newAnnouncement.title}
								onChange={handleInputChange}
							/>
						</div>
						<div>
							<label htmlFor="description">Description:</label>
							<textarea
								id="description"
								name="description"
								value={newAnnouncement.description}
								onChange={handleInputChange}
							></textarea>
						</div>
						<div>
							<label htmlFor="dateCreated">Date Created:</label>
							<input
								type="date"
								id="dateCreated"
								name="dateCreated"
								value={newAnnouncement.dateCreated}
								onChange={handleInputChange}
							/>
						</div>
						<button type="button" onClick={handleSave}>
							Save
						</button>
						<button type="button" onClick={handleCancel}>
							Cancel
						</button>
					</form>
				</>
			) : (
				<>
					<ul>
						{announcements.map((announcement) => (
							<li key={announcement.id}>
								<h3 className="title">{announcement.title}</h3>
								{selectedAnnouncementId === announcement.id && (
									<>
										<p>{announcement.description}</p>
										<p className="date">
											{
												announcement.dateCreated.split(
													"T"
												)[0]
											}
										</p>
									</>
								)}
								<button
									type="button"
									onClick={() => handleEdit(announcement.id)}
								>
									Edit
								</button>
								<button
									type="button"
									onClick={() =>
										handleShowDetails(announcement.id)
									}
								>
									{selectedAnnouncementId === announcement.id
										? "Hide Details"
										: "Show Details"}
								</button>
								<button
									className="delete"
									type="button"
									onClick={() =>
										handleDelete(announcement.id)
									}
								></button>
							</li>
						))}
					</ul>
					<form onSubmit={handleCreateAnnouncement}>
						<div>
							<label htmlFor="title">Title:</label>
							<input
								type="text"
								id="title"
								name="title"
								value={newAnnouncement.title}
								onChange={handleInputChange}
							/>
						</div>
						<div>
							<label htmlFor="description">Description:</label>
							<textarea
								id="description"
								name="description"
								value={newAnnouncement.description}
								onChange={handleInputChange}
							></textarea>
						</div>
						<div>
							<label htmlFor="dateCreated">Date Created:</label>
							<input
								type="date"
								id="dateCreated"
								name="dateCreated"
								value={newAnnouncement.dateCreated}
								onChange={handleInputChange}
							/>
						</div>
						<button type="submit">Create Announcement</button>
					</form>
				</>
			)}
		</>
	);
}

export default App;
