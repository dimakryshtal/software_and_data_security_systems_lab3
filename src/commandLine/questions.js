import { maxNumberOfFails } from "../index.js";
import { rl } from "./commandLine.js";
import { saveFileSystem } from "../data/fileSystem.js";
import { addOperation } from "../commands/operations.js";


export const askQuestion = (currUser, fileSystem) => new Promise(async (resolve, reject) => {
    const allUsers = fileSystem.filesAndDirs.find(obj => obj.name == "logBook")
    const allQuestions = fileSystem.filesAndDirs.find(obj => obj.name == "ask.txt").content
    const user = allUsers.content.find(user => user.userName == currUser)
    const questions = user.questions
    let asnwered = false
    while (!asnwered && user.numberOfMistakes < maxNumberOfFails) {
        let answer = await new Promise((resolve, reject) => {
            const questionID = questions[Math.floor(Math.random()*3)]
            const questionValues = allQuestions[questionID]
            rl.question(`Answer the question: what are a and x for your secret formula if the answer is ${questionValues.ans} `, (ans) => {
                const [a, x] = ans.split(" ")
                if(a == questionValues.a && x == questionValues.x ) {
                    console.log("Right answer")
                    asnwered = true
                } else {
                    
                    addOperation(fileSystem, currUser, null, 3, "Wrong answer. You have to log in again.")
                    user.numberOfMistakes++
                    saveFileSystem(fileSystem)
                    if(user.numberOfMistakes != maxNumberOfFails)process.exit(0)
                }
                resolve()
            })
        })
        if (asnwered) {
            resolve()
            return
        }
    }
    user.forbidden = true
    addOperation(fileSystem, currUser, null, "You've had too many errors")
    saveFileSystem(fileSystem)
    process.exit(0)
})