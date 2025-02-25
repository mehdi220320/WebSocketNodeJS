const nodemailer = require("nodemailer");
const cron = require("node-cron");
const UserService = require("../services/UserService");
const moment = require("moment-timezone"); // For timezone handling
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendEmail(to, subject, text, html = null) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: ", info.response);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}
function createCalendarEvent(task) {
    const startTime = moment(task.dueDate).utc().format("YYYYMMDDTHHmmss[Z]");
    const endTime = moment(task.dueDate).add(1, "hour").utc().format("YYYYMMDDTHHmmss[Z]");

    return `
BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
BEGIN:VEVENT
DTSTAMP:${moment().utc().format("YYYYMMDDTHHmmss[Z]")}
DTSTART:${startTime}
DTEND:${endTime}
SUMMARY:${task.title}
DESCRIPTION:${task.description || "No description provided."}
LOCATION:Online
STATUS:CONFIRMED
SEQUENCE:3
BEGIN:VALARM
TRIGGER:-PT15M
DESCRIPTION:Reminder
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR
    `.trim();
}
    async function scheduleReminderEmail(task) {
        try {
            const user = await UserService.getUserById(task.assignedTo);
            if (!user || !user.email || !task.dueDate) return;

            console.log(`📅 Sending task email with calendar invite to ${user.email}...`);

            const icsContent = createCalendarEvent(task);

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: "New Task Assigned 📌",
                text: `You have been assigned a new task: "${task.title}".`,
                html: `<p><strong>New Task Assigned</strong></p>
                   <p>Task: <strong>${task.title}</strong></p>
                   <p>Deadline: <strong>${task.dueDate}</strong></p>
                   <p><i>Click the attached file to add it to your calendar.</i></p>`,
                attachments: [
                    {
                        filename: "task-invite.ics",
                        content: icsContent,
                        contentType: "text/calendar",
                    },
                ],
            };

            const info = await transporter.sendMail(mailOptions);
            console.log("✅ Email with calendar invite sent: ", info.response);
        } catch (error) {
            console.error("❌ Error sending task email:", error);
        }
    }



module.exports = { sendEmail , scheduleReminderEmail };
