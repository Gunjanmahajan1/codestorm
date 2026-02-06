const CoreTeam = require("../models/CoreTeam.model");

/* -------------------- GET ALL MEMBERS -------------------- */
exports.getTeamMembers = async (req, res, next) => {
    try {
        // Sort by 'order' ascending (or createdAt if order is same)
        const members = await CoreTeam.find().sort({ order: 1, createdAt: 1 });

        res.status(200).json({
            success: true,
            data: members,
        });
    } catch (error) {
        next(error);
    }
};

/* -------------------- ADD MEMBER -------------------- */
exports.addMember = async (req, res, next) => {
    try {
        const { designation, name, order } = req.body;

        const member = await CoreTeam.create({ designation, name, order });

        res.status(201).json({
            success: true,
            message: "Member added successfully",
            data: member,
        });
    } catch (error) {
        next(error);
    }
};

/* -------------------- UPDATE MEMBER -------------------- */
exports.updateMember = async (req, res, next) => {
    try {
        const member = await CoreTeam.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Member updated successfully",
            data: member,
        });
    } catch (error) {
        next(error);
    }
};

/* -------------------- DELETE MEMBER -------------------- */
exports.deleteMember = async (req, res, next) => {
    try {
        const member = await CoreTeam.findByIdAndDelete(req.params.id);

        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Member deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
