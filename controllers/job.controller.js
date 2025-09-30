import { Job } from '../models/job.model.js';
export const postJob = async (req, res) => {
    try {
        console.log("🟢 Received POST /jobs/post request"); 
        console.log("Received Request Body:", req.body);  // ✅ Log request body

        if (!req.id) {
            return res.status(401).json({
                message: "Unauthorized: Please log in",
                success: false
            });
        }
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;
        console.log(companyId);
        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Please fill all the fields",
                success: false
            })
        }
        const job = await Job.create({
            title,
            description,
            requirement: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experience,
            position,
            company: companyId,
            createdBy: userId
        })
        res.status(201).json({
            message: "Job posted successfully",
            success: true,
            job
        })
    } catch (error) {
        console.log(error);
    }
}
export const getAllJobs = async (req, res)=>{
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex:keyword, $options: "i" } },
                { description: { $regex:keyword, $options: "i" } }
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({createdAt:-1});
        if (!jobs) {
            return res.status(404).json({
                message: "No jobs found",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const getJobById = async(req, res)=> {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"application"
        });
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }
        return res.status(200).json({
            job,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

//admin created jobs
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ createdBy: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
