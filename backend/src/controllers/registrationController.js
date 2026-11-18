const Registration = require('../models/Registration');
const Event = require('../models/Event');
const qrService = require('../services/qrService');
const { sendNotification } = require('../services/notificationService');

// @desc    Register for an event
// @route   POST /api/registrations/:eventId
// @access  Private (Student)
exports.registerForEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: `Registration unavailable: Event is currently ${event.status}`
      });
    }

    // Check registration deadline
    if (new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline for this event has passed'
      });
    }

    // Check capacity
    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Event is fully booked. Registration capacity reached.'
      });
    }

    // Check existing registration
    const existingRegistration = await Registration.findOne({ user: userId, event: eventId });
    if (existingRegistration) {
      if (existingRegistration.status === 'registered' || existingRegistration.status === 'attended') {
        return res.status(400).json({
          success: false,
          message: 'You are already registered for this event'
        });
      } else if (existingRegistration.status === 'cancelled') {
        // Re-activate registration
        const ticketId = qrService.generateTicketId();
        const qrPayload = qrService.generateQRPayload(ticketId, event._id, userId);

        existingRegistration.status = 'registered';
        existingRegistration.ticketId = ticketId;
        existingRegistration.qrCodeString = qrPayload;
        existingRegistration.registeredAt = new Date();
        await existingRegistration.save();

        await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: 1 } });

        const qrCodeDataUrl = await qrService.generateQRCodeImage(qrPayload);

        await sendNotification({
          recipientId: userId,
          recipientEmail: req.user.email,
          title: 'Registration Confirmed 🎉',
          message: `You have successfully re-registered for "${event.title}". Your digital QR pass is ready.`,
          type: 'registration',
          link: `/student/registrations`
        });

        return res.status(200).json({
          success: true,
          message: 'Successfully re-registered for event',
          registration: existingRegistration,
          qrCodeImage: qrCodeDataUrl
        });
      }
    }

    // Generate Ticket & Cryptographic QR
    const ticketId = qrService.generateTicketId();
    const qrPayload = qrService.generateQRPayload(ticketId, event._id, userId);

    const registration = await Registration.create({
      user: userId,
      event: event._id,
      ticketId,
      qrCodeString: qrPayload,
      status: 'registered'
    });

    // Atomically increment registered count
    await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: 1 } });

    // Generate QR Code base64 image
    const qrCodeDataUrl = await qrService.generateQRCodeImage(qrPayload);

    // Dispatch confirmation notification
    await sendNotification({
      recipientId: userId,
      recipientEmail: req.user.email,
      title: 'Registration Confirmed 🎉',
      message: `You have successfully registered for "${event.title}". Venue: ${event.venue} on ${new Date(event.dateTime).toLocaleString()}. Show your QR pass at the entrance.`,
      type: 'registration',
      link: `/student/registrations`
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Your digital pass has been generated.',
      registration,
      qrCodeImage: qrCodeDataUrl
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged in student's registrations
// @route   GET /api/registrations/my
// @access  Private (Student)
exports.getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate({
        path: 'event',
        select: 'title category dateTime venue coverImage status averageRating organizer',
        populate: {
          path: 'organizer',
          select: 'name organizationName'
        }
      })
      .sort({ registeredAt: -1 });

    // Attach rendered QR Code Image data URIs
    const enrichedRegistrations = await Promise.all(
      registrations.map(async (reg) => {
        const qrImage = await qrService.generateQRCodeImage(reg.qrCodeString);
        return {
          ...reg.toObject(),
          qrCodeImage: qrImage
        };
      })
    );

    res.json({
      success: true,
      count: enrichedRegistrations.length,
      registrations: enrichedRegistrations
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel a registration
// @route   PUT /api/registrations/:id/cancel
// @access  Private (Student)
exports.cancelRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id).populate('event');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    if (registration.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this registration'
      });
    }

    if (registration.status === 'attended') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel registration: Attendance has already been recorded'
      });
    }

    if (registration.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This registration is already cancelled'
      });
    }

    registration.status = 'cancelled';
    await registration.save();

    // Decrement event registeredCount
    await Event.findByIdAndUpdate(registration.event._id, { $inc: { registeredCount: -1 } });

    await sendNotification({
      recipientId: req.user._id,
      title: 'Registration Cancelled',
      message: `Your registration for "${registration.event.title}" has been cancelled.`,
      type: 'update'
    });

    res.json({
      success: true,
      message: 'Registration successfully cancelled',
      registration
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get attendee list for an event
// @route   GET /api/registrations/event/:eventId
// @access  Private (Organizer, Admin)
exports.getEventAttendees = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view attendee records' });
    }

    const registrations = await Registration.find({ event: eventId })
      .populate('user', 'name email department rollNumber avatar')
      .sort({ registeredAt: -1 });

    const totalRegistered = registrations.filter(r => r.status === 'registered' || r.status === 'attended').length;
    const totalAttended = registrations.filter(r => r.status === 'attended').length;

    res.json({
      success: true,
      totalRegistered,
      totalAttended,
      attendanceRate: totalRegistered > 0 ? Math.round((totalAttended / totalRegistered) * 100) : 0,
      attendees: registrations
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify QR Code Pass and Mark Attendance
// @route   POST /api/registrations/verify-attendance
// @access  Private (Organizer, Admin)
exports.verifyAttendance = async (req, res, next) => {
  try {
    const { qrData, ticketId, eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ success: false, message: 'Target event ID is required for verification' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to mark attendance for this event' });
    }

    let targetTicketId = ticketId;

    // If QR encoded string provided, cryptographically verify it
    if (qrData) {
      const verification = qrService.verifyQRPayload(qrData, eventId);
      if (!verification.valid) {
        return res.status(400).json({
          success: false,
          message: verification.error || 'Invalid or untrusted QR Code'
        });
      }
      targetTicketId = verification.ticketId;
    }

    if (!targetTicketId) {
      return res.status(400).json({ success: false, message: 'Ticket ID or QR code data required' });
    }

    const registration = await Registration.findOne({ ticketId: targetTicketId, event: eventId })
      .populate('user', 'name email department rollNumber avatar');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'No registration record found for this ticket and event'
      });
    }

    if (registration.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This registration ticket has been cancelled by the student'
      });
    }

    if (registration.status === 'attended') {
      return res.status(400).json({
        success: false,
        alreadyAttended: true,
        message: `Attendance already marked for ${registration.user.name} at ${new Date(registration.attendedAt).toLocaleTimeString()}`,
        registration
      });
    }

    // Mark attended
    registration.status = 'attended';
    registration.attendedAt = new Date();
    await registration.save();

    // Send notification to attendee
    await sendNotification({
      recipientId: registration.user._id,
      recipientEmail: registration.user.email,
      title: 'Attendance Verified ✅',
      message: `Your attendance for "${event.title}" has been successfully recorded. You are eligible to submit feedback after the event.`,
      type: 'update'
    });

    res.json({
      success: true,
      message: `Attendance verified successfully for ${registration.user.name}!`,
      registration
    });
  } catch (err) {
    next(err);
  }
};
