﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using PettiInn.DAL.Entities.EF5;
using PettiInn.DAL.Manager.Core.Managers;
using PettiInn.SOA.DTO;
using PettiInn.SOA.DTO.Shared;

namespace PettiInn.API.Areas.Console.Controllers
{
    public class RoleController : ControllerBase
    {
        [HttpPost]
        public JsonResult Roles(SearchCriterias criterias, string name)
        {
            var manager = this.GetManagerFor<IRoleManager>();
            var result = manager.Search(criterias, name);
            var resultDTOs = result.PageOfResults.Select(t => new RoleDTO(new Query[]
                {
                    new Query
                    {
                        Name = "Modules"
                    }
                }, t));

            return Json(new PagingResult<Role, RoleDTO>
                {
                    Total = result.Total,
                    TotalDisplay = result.TotalDisplay,
                    PageNumber = result.PageNumber,
                    PageCount = result.PageCount,
                    PageOfDTOs = resultDTOs
                });
        }

        [HttpPost]
        public JsonResult GetRole(int id, IEnumerable<string> query)
        {
            var queries = new Query[] { };

            if (query != null)
            {
                queries = query.Select(q => new Query { Name = q }).ToArray();
            }

            var manager = this.GetManagerFor<IRoleManager>();
            var result = manager.GetById(id);
            var resultDTO = new RoleDTO(queries, result);

            return Json(resultDTO);
        }

        [HttpPost]
        public JsonResult Create(RoleDTO dto)
        {
            var manager = this.GetManagerFor<IRoleManager>();
            var result = manager.Create(dto);
            var resultDTO = new RoleDTO(result);

            return Json(resultDTO);
        }

        [HttpPost]
        public JsonResult Update(RoleDTO dto)
        {
            var manager = this.GetManagerFor<IRoleManager>();
            var result = manager.Update(dto);
            var resultDTO = new RoleDTO(result);

            return Json(resultDTO);
        }

        [HttpPost]
        public JsonResult DeleteRole(RoleDTO dto)
        {
            var manager = this.GetManagerFor<IRoleManager>();
            var role = manager.Delete(dto.Id);
            var result = new RoleDTO(role);

            return Json(result);
        }
    }
}
