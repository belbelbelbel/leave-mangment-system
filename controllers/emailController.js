const nodemailer = require("nodemailer")

// Create transporter (using Gmail as example)
const createTransporter = () => {
  // Check if email credentials are provided
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("📧 Email credentials not configured - notifications disabled")
    return null
  }

  return nodemailer.createTransporter({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

// Send leave request notification to admin
const sendLeaveRequestNotification = async (leave, employee) => {
  try {
    const transporter = createTransporter()

    // If no transporter (no email config), just log and return
    if (!transporter) {
      console.log(`📧 [DEMO MODE] Leave request notification would be sent to admin for ${employee.name}`)
      console.log(`📧 Leave Type: ${leave.leaveType}, Days: ${leave.requestedDays || "N/A"}`)
      return
    }

    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@leavemanagement.com",
      to: process.env.ADMIN_EMAIL || "admin@company.com",
      subject: `New Leave Request - ${employee.name}`,
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4F46E5;">New Leave Request</h2>
                    <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>Employee Details:</h3>
                        <p><strong>Name:</strong> ${employee.name}</p>
                        <p><strong>Email:</strong> ${employee.email}</p>
                        
                        <h3>Leave Details:</h3>
                        <p><strong>Type:</strong> ${leave.leaveType}</p>
                        <p><strong>Days:</strong> ${leave.requestedDays || "N/A"}</p>
                        <p><strong>Start Date:</strong> ${new Date(leave.startDate).toLocaleDateString()}</p>
                        <p><strong>End Date:</strong> ${new Date(leave.endDate).toLocaleDateString()}</p>
                        <p><strong>Reason:</strong> ${leave.description}</p>
                        <p><strong>Status:</strong> <span style="color: #F59E0B;">${leave.status}</span></p>
                    </div>
                    <p>Please review and approve/reject this leave request in the admin dashboard.</p>
                    <a href="${process.env.FRONTEND_URL || "http://localhost:5000"}/pages/admin/admin-dashboard.html" 
                       style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                        View Dashboard
                    </a>
                </div>
            `,
    }

    await transporter.sendMail(mailOptions)
    console.log("📧 Leave request notification sent to admin")
  } catch (error) {
    console.log("📧 Email notification failed (this is normal for demo):", error.message)
  }
}

// Send leave status update to employee
const sendLeaveStatusUpdate = async (leave, employee, status) => {
  try {
    const transporter = createTransporter()

    // If no transporter (no email config), just log and return
    if (!transporter) {
      console.log(`📧 [DEMO MODE] Leave status update would be sent to ${employee.name}`)
      console.log(`📧 Status: ${status}, Leave Type: ${leave.leaveType}`)
      return
    }

    const statusColor = status === "Approved" ? "#10B981" : "#EF4444"
    const statusIcon = status === "Approved" ? "✅" : "❌"

    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@leavemanagement.com",
      to: employee.email,
      subject: `Leave Request ${status} - ${leave.leaveType}`,
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: ${statusColor};">${statusIcon} Leave Request ${status}</h2>
                    <p>Dear ${employee.name},</p>
                    <p>Your leave request has been <strong style="color: ${statusColor};">${status.toLowerCase()}</strong>.</p>
                    
                    <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>Leave Details:</h3>
                        <p><strong>Type:</strong> ${leave.leaveType}</p>
                        <p><strong>Days:</strong> ${leave.requestedDays || "N/A"}</p>
                        <p><strong>Start Date:</strong> ${new Date(leave.startDate).toLocaleDateString()}</p>
                        <p><strong>End Date:</strong> ${new Date(leave.endDate).toLocaleDateString()}</p>
                        <p><strong>Reason:</strong> ${leave.description}</p>
                        <p><strong>Status:</strong> <span style="color: ${statusColor};">${status}</span></p>
                        ${leave.approvedAt ? `<p><strong>Processed On:</strong> ${new Date(leave.approvedAt).toLocaleDateString()}</p>` : ""}
                    </div>
                    
                    ${
                      status === "Approved"
                        ? '<p style="color: #10B981;">Enjoy your time off!</p>'
                        : '<p style="color: #EF4444;">If you have any questions, please contact HR.</p>'
                    }
                    
                    <a href="${process.env.FRONTEND_URL || "http://localhost:5000"}/pages/employee/my-leaves.html" 
                       style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                        View My Leaves
                    </a>
                </div>
            `,
    }

    await transporter.sendMail(mailOptions)
    console.log(`📧 Leave status update sent to ${employee.email}`)
  } catch (error) {
    console.log("📧 Email notification failed (this is normal for demo):", error.message)
  }
}

// Send wellness event notification
const sendWellnessEventNotification = async (event, employees) => {
  try {
    const transporter = createTransporter()

    // If no transporter (no email config), just log and return
    if (!transporter) {
      console.log(`📧 [DEMO MODE] Wellness event notification would be sent to ${employees.length} employees`)
      console.log(`📧 Event: ${event.title}`)
      return
    }

    for (const employee of employees) {
      const mailOptions = {
        from: process.env.EMAIL_USER || "noreply@leavemanagement.com",
        to: employee.email,
        subject: `New Wellness Event - ${event.title}`,
        html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #4F46E5;">🌟 New Wellness Event</h2>
                        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3>${event.title}</h3>
                            <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> ${event.time}</p>
                            <p><strong>Location:</strong> ${event.location}</p>
                            <p><strong>Description:</strong> ${event.description}</p>
                            ${event.maxParticipants ? `<p><strong>Max Participants:</strong> ${event.maxParticipants}</p>` : ""}
                        </div>
                        <p>Don't miss out on this wellness opportunity!</p>
                        <a href="${process.env.FRONTEND_URL || "http://localhost:5000"}/pages/employee/wellness-events.html" 
                           style="background-color: #10B981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                            Register Now
                        </a>
                    </div>
                `,
      }

      await transporter.sendMail(mailOptions)
    }
    console.log(`📧 Wellness event notification sent to ${employees.length} employees`)
  } catch (error) {
    console.log("📧 Email notification failed (this is normal for demo):", error.message)
  }
}

module.exports = {
  sendLeaveRequestNotification,
  sendLeaveStatusUpdate,
  sendWellnessEventNotification,
}
