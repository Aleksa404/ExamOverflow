using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ExamOverflowApi.Entities;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ExamOverflowApi.Controllers
{
    [EnableCors("CORS")]
    [ApiController]
    [Route("api")]
    public class BaseController : ControllerBase
    {
        protected readonly ExamOverflowContext _dbContext;
        public BaseController(ExamOverflowContext db)
        {
            _dbContext = db;
        }
    }

}
