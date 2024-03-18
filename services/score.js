const scoreModel = require("../models/score");
exports.saveScores = async (userId, score) => {
    try {
        const todayBeginning = new Date();
        todayBeginning.setHours(0, 0, 0, 0);
        todayBeginning.setHours(todayBeginning.getHours() + 5, todayBeginning.getMinutes() + 30);
        const todayEnd = new Date(todayBeginning.getTime() + 24 * 60 * 60 * 1000)
        console.log(todayBeginning)
        console.log(todayEnd)
        const scores = await scoreModel.find({
            userId,
            createdAt: {
                $gte: todayBeginning, // Greater than or equal to the beginning of today
                $lt: todayEnd// Less than the beginning of tomorrow
            }
        });
        console.log(scores)
        if (scores.length >= 3) {
            return { error: "Score can be added maximum three times each day" }
        }
        const createdAt = new Date();
        createdAt.setHours(createdAt.getHours() + 5, createdAt.getMinutes() + 30);
        let res = await scoreModel.create({ userId, score, createdAt })
        return {success: true}
    }
    catch (error) {
        console.log(error)
        throw new Error(error)
    }
};

exports.overallRank = async (userId) => {
    let scores = await scoreModel.aggregate([
        {
            $group: {
                _id: "$userId",
                totalScore: { $sum: "$score" } // Calculate the sum of scores for each userId
            }
        },
        {
            $sort: { totalScore: -1 } // Sort by totalScore in descending order
        }
    ]);
    console.log(scores)
    const rank = scores.findIndex(entry => entry._id === userId) + 1;
    console.log(rank)
    if (rank !== 0) {
        return { success:true, rank, totalScore: scores[rank - 1].totalScore }
    } else {
        return { error: "No score found for that particular user" }
    }
    return rank
}

exports.getWeeklyScoreRank = async (userId) => {
    try {

        const startOfWeek = new Date(2024, 2, 1);
        startOfWeek.setHours(startOfWeek.getHours() + 5, startOfWeek.getMinutes() + 30);
        const currentDate = new Date();
        let endOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        const lastFullWeekEnd = new Date(endOfWeek);
        lastFullWeekEnd.setDate(lastFullWeekEnd.getDate() - (lastFullWeekEnd.getDay() + 6) % 7);
        const weeklyScores = [];
        for (let weekStart = startOfWeek; weekStart <= lastFullWeekEnd; weekStart.setDate(weekStart.getDate() + 7)) {
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 7);

            const weekScores = await scoreModel.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: weekStart,
                            $lte: weekEnd
                        }
                    }
                },
                {
                    $group: {
                        _id: "$userId",
                        totalScore: { $sum: "$score" }
                    }
                }
            ]);

            weeklyScores.push({
                startDate: weekStart.toISOString(),
                endDate: weekEnd.toISOString(),
                scores: weekScores
            });
        }
        endOfWeek.setHours(endOfWeek.getHours() + 5, endOfWeek.getMinutes() + 30);
        let currentDateNow = new Date();
        currentDateNow.setHours(currentDateNow.getHours() + 5, currentDateNow.getMinutes() + 30);
        console.log(endOfWeek)
        console.log(currentDateNow)
       
        const weeklyRanks = [];

        for (let weekIndex = 0; weekIndex < weeklyScores.length; weekIndex++) {
            const week = weeklyScores[weekIndex];
            const weekScores = week.scores;

            weekScores.sort((a, b) => b.totalScore - a.totalScore);

            const userEntry = weekScores.find(entry => entry._id === userId);
            const score = userEntry ? userEntry.totalScore : null;
            const rank = userEntry ? weekScores.findIndex(entry => entry._id === userId) + 1 : null; // Add 1 to convert from zero-based index to rank

            weeklyRanks.push({
                startDate: week.startDate,
                endDate: week.endDate,
                rank: rank,
                totalScore: score
            });
        }
        return weeklyRanks

    }
    catch (error) {
        console.log(error)
    }
}