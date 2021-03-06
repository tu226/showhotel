﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PettiInn.DAL.Entities.EF5
{
    public class EntityBase : IComparable<EntityBase>
    {
        public virtual int Id { get; protected set; }

        public override bool Equals(object obj)
        {
            return this.Id.Equals(((EntityBase)obj).Id);
        }

        public override int GetHashCode()
        {
            return this.Id.GetHashCode();
        }

        public virtual bool IsNew()
        {
            return this.Id <= 0;
        }

        public int CompareTo(EntityBase other)
        {
            return this.Id.CompareTo(other.Id);
        }
    }
}
