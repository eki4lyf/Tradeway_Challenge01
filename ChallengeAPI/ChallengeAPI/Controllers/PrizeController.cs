﻿using Microsoft.AspNetCore.Mvc;
using ChallengeAPI.Models;
using ChallengeAPI.Models.Views;

namespace ChallengeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrizeController : ControllerBase
    {
        private ChallengeDbContext context;
        public PrizeController(ChallengeDbContext context)
        {
            this.context = context;
        }

        [HttpGet("availablePrizes")]
        public ActionResult<List<Prize>> GetAvailablPrizes()
        {
            var prizes = from p in context.Prizes
                         where p.QuantityAvailable > 0
                         select new PrizeView
                         {
                             Id=p.Id,
                             Name = p.Name,
                             ImageUrl = p.ImageUrl,
                             QuantityAvailable = p.QuantityAvailable,

                         };
            if(prizes!= null)
            {
                return Ok(prizes);
            }
            return BadRequest("No Prizes");
        }
        
    }
}
