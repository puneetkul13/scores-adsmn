const scoreService = require("../services/score")
const registerService = require("../services/register")
exports.saveScore = async (req, res) => {
    try {
        let { userId, score } = req.body

        if (!userId) {
            res.status(500).json({ error: "userId is mandatory" });
        }
        if (!score) {
            res.status(500).json({ error: "score is mandatory" });
        }
        if (score < 50 || score > 500) {
            res.status(500).json({ error: "score should be between 50 and 500" });
        }
        let user = await registerService.getUser(userId);
        if (user.length === 0) {
            res.status(500).json({ error: "user not found" });
        }
        let res1 = await scoreService.saveScores(userId, score)
        return res.status(200).json(res1);
    }
    catch (error) {
        return res.status(500).json({ error: 'error' })
    }
}

exports.overallDashboard = async (req, res) => {
    try {
        let { userId } = req.body
        if (!userId) {
            res.status(500).json({ error: "userId is mandatory" });
        }
        let user = await registerService.getUser(userId);
        if (user.length === 0) {
            res.status(500).json({ error: "user not found" });
        }
        let res1 = await scoreService.overallRank(userId)
        return res.status(200).json(res1);
    }
    catch (error) {
        return res.status(500).json({ error: 'error' })
    }
}

exports.getWeeklyScore = async (req, res) => {
    try {
        let { userId } = req.body
        if (!userId) {
            res.status(500).json({ error: "userId is mandatory" });
        }
        let user = await registerService.getUser(userId);
        if (user.length === 0) {
            res.status(500).json({ error: "user not found" });
        }
        let res1 = await scoreService.getWeeklyScoreRank(userId)
        
        for(let i=0; i<res1.length; i++){
            console.log(res1[i])
            delete res1[i].startDate
            delete res1[i].endDate
            res1[i] = { weekNo: i+1, ...res1[i] };
        }
        return res.status(200).json({success: true, weeks: res1});
    }
    catch (error) {
        return res.status(500).json({ error: 'error' })
    }
}